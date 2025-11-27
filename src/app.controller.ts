import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { config } from './config';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService
  ) { }

  @Get("file/excel")
  async getExcelFileData() {
    return await this.appService.getExcelFile()
  }

  @Get("file/pdf")
  async getPdfFileData() {
    return await this.appService.getPdfFile()
  }

  @Get()
  getHello(): any {
    return {
      status: HttpStatus.OK,
      message: config.name
    };
  }
}
