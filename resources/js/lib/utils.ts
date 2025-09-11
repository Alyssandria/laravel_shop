import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type methods = "GET" | "POST" | "DELETE" | "PUT"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function roundNumberByDecimalPlace(number: number, decimalPlaces: number) {
    return Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

export function fetchWithHeaders(route: string, method: methods = "GET") {
    return fetch(route, {
        method: method,
        headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content,
        }
    });
}
