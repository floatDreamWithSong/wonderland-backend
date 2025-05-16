import { Controller, Post, Body, Logger, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { PassageService } from './passage.service';
import { passageCreateSchema } from 'src/validators/passage';
import { PassageCreateInput } from 'src/types/passage';
import { ZodValidationPipe } from 'src/common/pipes/zod-validate.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/types/jwt';

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
}
