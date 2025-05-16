import { Module } from '@nestjs/common';
import { CosModule } from 'src/common/utils/cos/cos.module';
import { PassageController } from './passage.controller';
import { PassageService } from './passage.service';

@Module({
  imports: [CosModule],
  controllers: [PassageController],
  providers: [PassageService],
})
export class PassageModule {}
