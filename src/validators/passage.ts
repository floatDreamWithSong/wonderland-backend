import { z } from 'zod';

export const passageCreateSchema = z.object({
  title: z.string().min(1, { message: '标题不能为空' }).max(30, { message: '标题不能超过30字！' }),
  content: z.string().min(1, { message: '内容不能为空' }).max(1500, { message: '不能超过1500字！' }),
  themes: z.array(z.string().length(1, { message: '主题不能为空' })).optional(),
  images: z.array(z.string()).optional(), //图片链接
  pushUserTags: z.array(z.number()).optional(),
  pushType: z.literal(0).or(z.literal(1)).or(z.literal(2)),
  pushLimit: z.number().default(0),
  order: z.array(z.number().min(0, { message: '交易报酬不能为负数' })).optional(),
});
