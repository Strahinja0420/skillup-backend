import { Injectable } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { DatabaseService } from 'src/database/database.service';
import { connect } from 'http2';

@Injectable()
export class AuctionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createAuctionDto: CreateAuctionDto, userId: number) {
    if (!userId) {
      throw new Error('User ID is missing!');
    }

    return await this.databaseService.auction.create({
      data: {
        ...createAuctionDto,
        creator: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.databaseService.auction.findMany({
      orderBy :{endTime : 'asc'}
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} auction`;
  }

  async update(id: number, updateAuctionDto: UpdateAuctionDto) {
    return await this.databaseService.auction.update({
      where: { id },
      data: {
        ...updateAuctionDto,
      },
    });
  }

  async remove(id: number) {
    return await this.databaseService.auction.delete({
      where :{
        id
      }
    });
  }
}
