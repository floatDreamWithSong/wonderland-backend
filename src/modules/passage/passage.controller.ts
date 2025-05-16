import { Controller, Post, Body, Logger, Delete, Param, ParseIntPipe, Put, Query } from '@nestjs/common';
import { PassageService } from './passage.service';
import { passageCreateSchema } from 'src/validators/passage';
import { PassageCreateInput } from 'src/types/passage';
import { ZodValidationPipe } from 'src/common/pipes/zod-validate.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/types/jwt';
import { z } from 'zod';
import { OrderStatus, ORDER_STATUS } from 'src/types/order';

@Controller('passage')
export class PassageController {
  private readonly logger = new Logger(PassageController.name);
  constructor(private readonly passageService: PassageService) {}
  // 创建文章
  @Post()
  async createPassage(
    @Body(new ZodValidationPipe(passageCreateSchema)) data: PassageCreateInput,
    @User() user: JwtPayload,
  ) {
    return this.passageService.createPassage(data, user);
  }
  @Delete(':id')
  async deletePassage(@Param('id', ParseIntPipe) id: number) {
    return this.passageService.deletePassage(id);
  }
  @Delete('order/:id')
  async deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.passageService.deleteOrder(id);
  }
  @Put('order/status/:id')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status', new ZodValidationPipe(z.nativeEnum(ORDER_STATUS))) status: OrderStatus,
  ) {
    return this.passageService.updateOrderStatus(id, status);
  }
}
