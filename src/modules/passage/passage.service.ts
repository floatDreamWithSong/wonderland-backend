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
          themes: {
            connectOrCreate: themes?.map((theme) => ({
              where: { name: theme },
              create: { name: theme },
            })),
          },
        },
      });
      return passage;
    });
  }
}
