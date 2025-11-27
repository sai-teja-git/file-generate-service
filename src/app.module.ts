import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ExcelService } from './services/excel.service';
import { PdfService } from './services/pdf.service';
import { CurrencyService } from './services/currency.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ExcelService, PdfService, CurrencyService]
})
export class AppModule { }
