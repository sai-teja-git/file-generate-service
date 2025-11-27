// excel.service.ts
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { join } from 'path';

/* The `export interface ISheets {` statement in the TypeScript code is defining an interface named
`ISheets`. Interfaces in TypeScript are used to define the structure of objects. In this case, the
`ISheets` interface is specifying the structure expected for objects representing sheets in an Excel
file. */
export interface ISheets {
    name?: string;
    headers: Partial<ExcelJS.Column>[],
    rows: any[]
}

/* The `export interface IExcelOutput` in the TypeScript code is defining an interface named
`IExcelOutput`. This interface specifies the structure of objects that represent the output of the
`generateExcelFile` function in the `ExcelService` class. */
export interface IExcelOutput {
    buffer: ExcelJS.Buffer;
    fileSaved: boolean;
    error: Error | null;
    filePath: string | null;
}

@Injectable()
export class ExcelService {

    /**
     * The function `generateExcelFile` creates an Excel file with multiple sheets based on the
     * provided data and optionally saves it to a specified output path.
     * @param {ISheets[]} sheets - An array of objects representing different sheets in the Excel file.
     * Each object should have a `name` property for the sheet name and a `headers` property for
     * defining the columns in the sheet. The `headers` property should be an array of objects with
     * keys like `header`, `key`, and
     * @param {string} [outputPath] - The `outputPath` parameter in the `generateExcelFile` function is
     * a string that represents the directory path where the Excel file will be saved. If you provide a
     * valid `outputPath`, the function will attempt to save the generated Excel file in that
     * directory. If you don't provide an `
     * @param {string} [fileName] - The `fileName` parameter in the `generateExcelFile` function is an
     * optional parameter that specifies the name of the Excel file to be generated. If provided, it
     * will be used as the filename for the Excel file. If not provided, a default filename in the
     * format `gen-{timestamp}.xlsx
     * @returns The `generateExcelFile` function returns a Promise that resolves to an object of type
     * `IExcelOutput`. This object contains the following properties:
     * - `buffer`: A buffer containing the Excel file data.
     * - `fileSaved`: A boolean indicating whether the file was successfully saved to the specified
     * output path.
     * - `error`: An error object if an error occurred during file saving, otherwise null.
     * -
     */
    async generateExcelFile(sheets: ISheets[], outputPath?: string, fileName?: string): Promise<IExcelOutput> {
        const workbook = new ExcelJS.Workbook();

        let index = 0
        for (const sheet of sheets) {
            const worksheet = workbook.addWorksheet(sheet.name ?? `Sheet-${index + 1}`);
            /**
             * header format
             * { header: 'ID', key: 'id', width: 10 }
             */
            worksheet.columns = sheet.headers;

            // Add rows
            sheet.rows.forEach(row => {
                worksheet.addRow(row);
            });

            // Optional: Apply styling
            worksheet.getRow(1).font = { bold: true };
            index += 1;
        }

        const buffer = await workbook.xlsx.writeBuffer();
        let fileSaved = false;
        let error: IExcelOutput["error"] = null;
        let filePath: IExcelOutput["filePath"] = null;
        if (outputPath) {
            const defaultName = `gen-${Date.now()}.xlsx`;
            filePath = join(process.cwd(), outputPath, fileName ?? defaultName);
            try {
                await workbook.xlsx.writeFile(filePath);
                fileSaved = true;
            } catch (err) {
                console.error('Error saving Excel file:', error);
                error = err
            }
        }
        return {
            buffer,
            fileSaved,
            error,
            filePath
        }
    }
}