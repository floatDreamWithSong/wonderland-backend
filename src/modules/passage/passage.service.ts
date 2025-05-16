import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/utils/prisma/prisma.service';
import { JwtPayload } from 'src/types/jwt';
import { PassageCreateInput } from 'src/types/passage';

@Injectable()
export class PassageService {
  private readonly logger = new Logger(PassageService.name);
  constructor(private readonly prisma: PrismaService) {}
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
    // const res = await this.prisma.passage.delete({
    //   where: { pid },
    //   include: {
    //     images: true,
    //     Order: true,
    //     pushUserTags: true,
    //     themes: true,
    //   },
    // });
    // if (res.images.length > 0) {
    //   await this.prisma.passageImage.deleteMany({
    //     where: {
    //       passageId: pid,
    //     },
    //   });
    // }
    // if (res.Order.length > 0) {
    //   await this.prisma.order.deleteMany({
    //     where: {
    //       passageId: pid,
    //     },
    //   });
    // }
    // // 移除关系
    // await this.prisma.passageToTheme.deleteMany({
    //   where: {
    //     passageId: pid,
    //   },
    // });
    // await this.prisma.passageToUserTag.deleteMany({
    //   where: {
    //     passageId: pid,
    //   },
    // });
    return this.prisma.$transaction(async (tx) => {
      await tx.passage.delete({
        where: { pid },
      });
    });
  }
}
