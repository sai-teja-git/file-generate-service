import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ExcelService } from './services/excel.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ExcelService]
})
export class AppModule { }
