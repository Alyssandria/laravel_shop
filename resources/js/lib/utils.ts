import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function roundNumberByDecimalPlace(number: number, decimalPlaces: number) {
    return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}
