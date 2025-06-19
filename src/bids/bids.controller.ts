import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller()
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post('auctions/:auctionId/bid')
  create(
    @Body() createBidDto: CreateBidDto,
    @CurrentUser() user: any,
    @Param('auctionId', ParseIntPipe) auctionId: number,
  ) {
    return this.bidsService.create({ ...createBidDto, auctionId }, user.userId);
  }

  @Get()
  findAll() {
    return this.bidsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bidsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto) {
    return this.bidsService.update(+id, updateBidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bidsService.remove(+id);
  }
}
