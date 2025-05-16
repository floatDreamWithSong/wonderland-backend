import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CosService } from 'src/common/utils/cos/cos.service';
import { PrismaService } from 'src/common/utils/prisma/prisma.service';
import { JwtPayload } from 'src/types/jwt';
import { ORDER_STATUS, isValidOrderStatusTransition, getOrderStatusDesc } from '../../types/order';
import { PassageCreateInput } from 'src/types/passage';
import { OrderStatus } from '../../types/order';

@Injectable()
export class PassageService {
  private readonly logger = new Logger(PassageService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly cosService: CosService,
  ) {}
  async createPassage(data: PassageCreateInput, user: JwtPayload) {
    const { title, content, themes, images, pushUserTags, pushType, pushLimit, order } = data;
    // 创建基本文章信息，标题，内容，作者，图片，推送类型，推送流量上限
    return this.prisma.$transaction(async (tx) => {
      const passage = await tx.passage.create({
        data: {
          title,
          content,
          authorId: user.uid,
          pushType,
          pushLimit,
          images: {
            create: images?.map((image) => ({
              url: image,
            })),
          },
          Order: {
            create: order?.map((reward) => ({
              userId: user.uid,
              reward,
            })),
          },
          pushUserTags: {
            create: pushUserTags?.map((tag) => ({
              userTagId: tag,
            })),
          },
          PassageToTheme: {
            create: themes?.map((theme) => ({
              theme: {
                connectOrCreate: {
                  where: { name: theme },
                  create: { name: theme },
                },
              },
            })),
          },
        },
        include: {
          author: {
            select: {
              uid: true,
              username: true,
              avatar: true,
            },
          },
          images: true,
          Order: true,
          pushUserTags: true,
          PassageToTheme: true,
        },
      });
      return passage;
    });
  }
  async deletePassage(pid: number) {
    // 先检查文章是否存在
    const passage = await this.prisma.passage.findUnique({
      where: { pid },
      include: {
        Order: true,
        images: true,
      },
    });

    if (!passage) {
      throw new NotFoundException('文章不存在');
    }

    // 检查是否有非取消状态的订单
    const hasUnCancelledOrder = !passage.Order.every((order) => order.status === ORDER_STATUS.CANCELLED);

    if (hasUnCancelledOrder) {
      throw new BadRequestException('存在非取消状态的订单，不能删除文章');
    }
    await this.prisma.$transaction(async (tx) => {
      // 并行删除所有关联数据
      await Promise.all([
        // 删除所有已取消的订单
        tx.order.deleteMany({
          where: {
            passageId: pid,
            status: ORDER_STATUS.CANCELLED,
          },
        }),
        // 删除所有点赞
        tx.passageLike.deleteMany({
          where: {
            passageId: pid,
          },
        }),
        // 删除所有评论点赞
        tx.commentLike.deleteMany({
          where: {
            comment: {
              passageId: pid,
            },
          },
        }),
        // 删除关联的评论
        tx.comment.deleteMany({
          where: {
            passageId: pid,
          },
        }),
        // 删除关联的收藏
        tx.favorite.deleteMany({
          where: {
            passageId: pid,
          },
        }),
        // 删除关联的主题关系
        tx.passageToTheme.deleteMany({
          where: {
            passageId: pid,
          },
        }),
        // 删除关联的推送用户标签关系
        tx.passageToUserTag.deleteMany({
          where: {
            passageId: pid,
          },
        }),
        // 删除关联的图片
        tx.passageImage.deleteMany({
          where: {
            passageId: pid,
          },
        }),
      ]);

      // 执行删除文章
      await tx.passage.delete({
        where: { pid },
      });
    });
    if (passage.images.length > 0) {
      await this.cosService.deleteFilesByUrls(passage.images.map((image) => image.url));
    }
    return 'success';
  }

  async deleteOrder(oid: number) {
    return this.prisma.order.delete({
      where: {
        oid,
        status: {
          in: [ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED_PAID],
        },
      },
    });
  }
  async updateOrderStatus(oid: number, toStatus: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { oid },
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    // 允许的流程：
    // 创建订单 -> 接单 -> 完成 -> 支付
    // 创建订单 -> 接单 -> 取消
    // 创建订单 -> 取消
    const fromStatus = order.status as OrderStatus;
    if (!isValidOrderStatusTransition(fromStatus, toStatus)) {
      throw new BadRequestException(
        `订单状态转换不合法：${getOrderStatusDesc(fromStatus)} -> ${getOrderStatusDesc(toStatus)}`,
      );
    }

    return this.prisma.order.update({
      where: { oid },
      data: { status: toStatus },
    });
  }
}
