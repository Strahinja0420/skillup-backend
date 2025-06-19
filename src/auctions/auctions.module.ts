import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { DatabaseService } from 'src/database/database.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      dest: './public/images',
      storage: diskStorage({
        destination: './public/images',
        filename: (_, file, cb) => {
          cb(null, new Date().getTime() + '-' + file.originalname);
        },
      }),
    }),
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, DatabaseService],
})
export class AuctionsModule {}
