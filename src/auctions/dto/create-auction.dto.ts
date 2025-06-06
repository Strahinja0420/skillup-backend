import { IsDateString, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { AuctionCategory, User } from 'generated/prisma';
import { CurrentUser } from 'src/common/decorators/user.decorator';

export class CreateAuctionDto {
  @IsString()
  title: string;


  @IsEnum(AuctionCategory)
  category : AuctionCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  startingBid: number;

  @IsOptional()
  @IsNumber()
  reservePrice?: number;

  @IsOptional()
  @IsNumber()
  buyNowPrice?: number;

  @IsDateString()
  endTime: Date;

}
