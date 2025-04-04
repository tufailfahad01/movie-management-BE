import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    return { url: result.url };
  }

}
