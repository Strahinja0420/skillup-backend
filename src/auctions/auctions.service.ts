import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuctionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createAuctionDto: CreateAuctionDto, userId: number) {
    if (!userId) {
      throw new Error('User ID is missing!');
    }

    const endTime = new Date(createAuctionDto.endTime);
    const now = new Date();

    if (endTime <= now) {
      throw new BadRequestException('Auction must end in the future.');
    }

    try {
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
    } catch (error) {
      console.log(error);

      throw new BadRequestException(
        'Something went wrong while creating an auction.',
      );
    }
  }

  async findAll() {
    return await this.databaseService.auction.findMany({
      orderBy: { endTime: 'desc' },
      include: {
        bids: true,
      },
    });
  }

  async findOne(id: number) {
    return this.databaseService.auction.findUnique({
      where: {
        id,
      },
    });
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
      where: {
        id,
      },
    });
  }
}
