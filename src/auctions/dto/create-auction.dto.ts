import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuctionCategory } from 'generated/prisma';

export class CreateAuctionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsEnum(AuctionCategory)
  category: AuctionCategory;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNumber()
  @IsPositive()
  startingBid: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  reservePrice?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  buyNowPrice?: number;

  @IsDateString()
  endTime: string;
}

