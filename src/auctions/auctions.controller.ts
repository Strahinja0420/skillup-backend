import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { AuthorInterceptor } from 'src/users/interceptors/author.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createAuctionDto: CreateAuctionDto, @CurrentUser() user : any) {
    return this.auctionsService.create(createAuctionDto, user.userId);
  }

  @Get()
  findAll() {
    return this.auctionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
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
