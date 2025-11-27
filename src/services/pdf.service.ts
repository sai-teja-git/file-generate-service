import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';

export interface IPdfOutput {
    buffer: Uint8Array<ArrayBufferLike>;
    fileSaved: boolean;
    error: Error | null;
    filePath: string | null;
}

@Injectable()
export class PdfService {
    async generatePdf(data: any, outputPath?: string, fileName?: string): Promise<IPdfOutput> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Load your HTML template (e.g., using fs.readFileSync and replacing placeholders)
        const templatePath = path.join(__dirname, '..', 'templates', 'report.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        // Replace placeholders with dynamic data (example using simple string replacement)
        htmlContent = htmlContent.replace('{{account_name}}', data.account_name);
        htmlContent = htmlContent.replace('{{registered_office}}', data.registered_office);
        htmlContent = htmlContent.replace('{{pan_number}}', data.pan_number);

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const buffer = await page.pdf({ format: 'A4' }); // Customize options as needed
        let fileSaved = false;
        let error: IPdfOutput["error"] = null;
        let filePath: IPdfOutput["filePath"] = null;
        if (outputPath) {
            const defaultName = `gen-${Date.now()}.pdf`;
            filePath = join(process.cwd(), outputPath, fileName ?? defaultName);
            try {
                await fs.writeFileSync(filePath, buffer);
                fileSaved = true;
            } catch (err) {
                console.error('Error saving Excel file:', error);
                error = err
            }
        }
        await browser.close();
        return {
            buffer,
            fileSaved,
            error,
            filePath
        }
    }
}