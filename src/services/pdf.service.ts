import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
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

    async generatePdf(data: any, templateName: string, outputPath?: string, fileName?: string): Promise<IPdfOutput> {
        const templatePath = join(process.cwd(), 'src/templates/pdf', templateName);
        const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(htmlTemplate);
        // Generate HTML output
        const html = template(data);

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // Set HTML content
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF
        const buffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
        });
        await browser.close();

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

        return {
            buffer,
            fileSaved,
            error,
            filePath
        }
    }
}