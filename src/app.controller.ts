import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService
  ) { }

  @Get("file/excel")
  async getExcelFileData() {
    return await this.appService.getExcelFile()
  }

  @Get()
  getHello(): any {
    return {
      status: HttpStatus.OK,
      message: "Server Here1!"
    };
  }
}
