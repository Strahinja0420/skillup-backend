import { PartialType } from '@nestjs/mapped-types';
import { CreateAuctionDto } from './create-auction.dto';
import { IsNumber } from 'class-validator';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {}
