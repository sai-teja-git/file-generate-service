import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { ExcelService } from './services/excel.service';
import { PdfService } from './services/pdf.service';
import { CurrencyService } from './services/currency.service';

@Injectable()
export class AppService {

    constructor(
        private readonly excelService: ExcelService,
        private readonly pdfService: PdfService,
        private readonly currencyService: CurrencyService,
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
            const filePath = join(process.cwd(), 'src/const/finance.json');
            const rawData = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(rawData);
            const currencyCode = "INR"
            const pdfData = {
                title: "Nov,2025 Overview",
                spends: { total: this.currencyService.format(data.spends.total, currencyCode), icon: "fa-solid fa-coins" },
                estimations: { total: this.currencyService.format(data.estimations.total, currencyCode), icon: "fa-solid fa-chart-line" },
                income: { total: this.currencyService.format(data.income.total, currencyCode), icon: "fa-solid fa-wallet" },
                tables: [
                    {
                        tableTitle: "Spends Summary",
                        items: data.spends.data.map(e => ({ ...e, value: this.currencyService.format(e.value, currencyCode) })),
                    },
                    {
                        tableTitle: "Estimations Summary",
                        items: data.estimations.data.map(e => ({ ...e, value: this.currencyService.format(e.value, currencyCode) })),
                    },
                    {
                        tableTitle: "Income Summary",
                        items: data.income.data.map(e => ({ ...e, value: this.currencyService.format(e.value, currencyCode) })),
                    },
                ]
            }

            const { buffer, ...result } = await this.pdfService.generatePdf(pdfData, "overview.html", "src/generated")
            return {
                status: HttpStatus.OK,
                data: result,
            }
        } catch (error) {
            throw new HttpException(error.message, error.status ?? 500)
        }
    }
}
