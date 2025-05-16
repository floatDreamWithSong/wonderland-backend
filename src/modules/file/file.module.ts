import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { CosModule } from 'src/common/utils/cos/cos.module';
@Module({
  imports: [CosModule],
  controllers: [FileController],
})
export class FileModule {}
