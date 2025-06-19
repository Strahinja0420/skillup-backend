import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { DatabaseService } from 'src/database/database.service';
import { connect } from 'http2';

@Injectable()
export class BidsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createBidDto: CreateBidDto & { auctionId: number },
    userId: number,
  ) {
    const auction = this.databaseService.auction.findUnique({
      where: {
        id: createBidDto.auctionId,
      },
      include: {
        bids: true,
      },
    });

    if (!auction) {
      throw new BadRequestException('Cannot find auction with that ID');
    }

    return await this.databaseService.bid.create({
      data: {
        amount: createBidDto.ammount,
        auction: {
          connect: {
            id: createBidDto.auctionId,
          },
        },
        bidder: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all bids`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bid`;
  }

  update(id: number, updateBidDto: UpdateBidDto) {
    return `This action updates a #${id} bid`;
  }

  remove(id: number) {
    return `This action removes a #${id} bid`;
  }
}
