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
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @UseInterceptors(FileInterceptor('images'))
  @Post()
  async create(
    @Body() createAuctionDto: CreateAuctionDto,
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const newAuction = await this.auctionsService.create(
        { ...createAuctionDto, images: `public/images/${file.filename}` },
        user.userId,
      );

      // if (!newAuction?.id) {
      //   if (file?.path) {
      //     fs.unlink(file.path, (err) => {
      //       if (err) console.error('Failed to delete file:', file.path, err);
      //     });
      //   }
      // }

      return newAuction;
    } catch (error) {}
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.auctionsService.findAll();
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
