import { Controller, UseInterceptors, Post, Logger, UploadedFiles, Delete, Body } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CosService } from 'src/common/utils/cos/cos.service';

@Controller('file')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly cosService: CosService) {}
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async uploadFile(@UploadedFiles() files: { files?: Express.Multer.File[] }) {
    this.logger.log(`Uploading file: ${files.files?.reduce((acc, file) => acc + file.originalname + ',', '')}`);
    return this.cosService.uploadToGetUrls(files.files ?? []).then((urls) => {
      this.logger.log(`Uploaded file: ${urls.reduce((acc, url) => acc + url + '\n', '')}`);
      return urls;
    });
  }
  @Delete()
  deleteFile(@Body('urls') urls: string[]) {
    this.logger.log(`Deleting file: ${urls.reduce((acc, url) => acc + url + '\n', '')}`);
    return this.cosService.deleteFilesByUrls(urls);
  }
}
