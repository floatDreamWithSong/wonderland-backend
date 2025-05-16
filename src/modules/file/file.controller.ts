import { Controller, UseInterceptors, Post, Logger, UploadedFiles, Delete, Body } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CosService } from 'src/common/utils/cos/cos.service';

@Controller('file')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly cosService: CosService) {}
  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async uploadFile(@UploadedFiles() files: { images?: Express.Multer.File[] }) {
    this.logger.log(`Uploading file: ${files.images?.reduce((acc, file) => acc + file.originalname + ',', '')}`);
    return this.cosService.uploadToGetUrls(files.images ?? []).then(console.log);
  }
  @Delete('delete')
  deleteFile(@Body('url') url: string) {
    this.logger.log(`Deleting file: ${url}`);
    return this.cosService.deleteFileByUrl(url);
  }
}
