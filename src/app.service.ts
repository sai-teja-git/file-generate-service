import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { ExcelService } from './services/excel.service';

@Injectable()
export class AppService {

    constructor(
        private readonly excelService: ExcelService
    ) { }

    private convertToPascalCase(text: string): string {
        try {
            return text.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")
        } catch { }
        return text
    }

    async getExcelFile() {
        try {
            const filePath = join(process.cwd(), 'src/const/random.json');
            const rawData = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(rawData);
            const keys = Object.keys(data[0])
            const headers = keys.map(key => ({
                header: this.convertToPascalCase(key),
                key
            }))
            const sheets = [
                {
                    headers,
                    rows: data
                }
            ]
            const { buffer, ...result } = await this.excelService.generateExcelFile(sheets, "src/generated")
            // res.header('Content-disposition', 'attachment; filename=random.xlsx');
            // res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            // return res.send(excelBuffer);
            return {
                status: HttpStatus.OK,
                data: result
            }
        } catch (error) {
            throw new HttpException(error.message, error.status ?? 500)
        }
    }

    async getPdfFile() {
        try {
            const filePath = join(process.cwd(), 'src/const/random.json');
            const rawData = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(rawData);
            const keys = Object.keys(data[0])
            const headers = keys.map(key => ({
                header: this.convertToPascalCase(key),
                key
            }))
            const sheets = [
                {
                    headers,
                    rows: data
                }
            ]
            const { buffer, ...result } = await this.excelService.generateExcelFile(sheets, "src/generated")
            // res.header('Content-disposition', 'attachment; filename=random.xlsx');
            // res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            // return res.send(excelBuffer);
            return {
                status: HttpStatus.OK,
                data: result
            }
        } catch (error) {
            throw new HttpException(error.message, error.status ?? 500)
        }
    }
}
