import { z } from 'zod';
export const WeChatRegisterByPhoneSchema = z.object({
  // "avatar": z.union([z.null(), z.string()]).optional(),
  encryptedData: z.string(),
  iv: z.string(),
  // "name": z.union([z.null(), z.string()]).optional(),
});
export type WechatRegisterByPhoneDto = z.infer<typeof WeChatRegisterByPhoneSchema>;
