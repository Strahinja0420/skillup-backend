import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [],
  controllers: [AuctionsController],
  providers: [AuctionsService, DatabaseService],
})
export class AuctionsModule {}
