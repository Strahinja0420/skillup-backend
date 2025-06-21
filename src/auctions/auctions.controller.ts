import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { join } from 'path';
import { Response } from 'express';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @UseInterceptors(FileInterceptor('images'))
  @Post()
  async create(
    @Body() createAuctionDto: CreateAuctionDto,
    @CurrentUser() user: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      console.log('Received create auction request:', {
        dto: createAuctionDto,
        userId: user.userId,
        file: file ? file.filename : 'No file uploaded',
      });

      const auctionData = {
        ...createAuctionDto,
        images: file ? `${file.filename}` : createAuctionDto.images,
      };

      console.log('Processed auction data:', auctionData);

      const newAuction = await this.auctionsService.create(
        auctionData,
        user.userId,
      );

      console.log('Created auction:', newAuction);
      return newAuction;
    } catch (error) {
      console.error('Error in auction creation:', error);
      if (file?.path) {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Failed to delete file:', err);
        });
      }
      throw error;
    }
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.auctionsService.findAll();
  }

  @IsPublic()
  @Get('getimage/:imageName')
  async getImage(
    @Param('imageName') imageName: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    try {
      const filePath = join(process.cwd(), 'public', 'images', imageName);
      const file = fs.createReadStream(filePath);

      res.set({
        'Content-Type': this.getMimeType(imageName),
      });

      return new StreamableFile(file);
    } catch (error) {
      console.error('Error serving image:', error);
      throw error;
    }
  }

  private getMimeType(filename: string): string {
    const extension = (filename.split('.').pop() ?? 'jpg').toLowerCase();
    switch (extension) {
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionsService.update(+id, updateAuctionDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auctionsService.remove(+id);
  }
}
