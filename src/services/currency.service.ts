import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyService {
    /**
     * Formats a number into a localized currency string.
     */
    format(value: number, currencyCode: string, locale?: string): string {
        const localeEdit = locale ? locale : `en-${currencyCode.slice(0, 2)}`
        return new Intl.NumberFormat(localeEdit, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        }).format(value);
    }
}
