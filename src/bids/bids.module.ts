import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [BidsController],
  providers: [BidsService, DatabaseService],
})
export class BidsModule {}
