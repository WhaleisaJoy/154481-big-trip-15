import dayjs from 'dayjs';

export const sortPointsByDay = (a, b) => a.dateFrom - b.dateFrom;

export const sortPointsByTime = (a, b) => dayjs(b.dateTo).diff(dayjs(b.dateFrom)) - dayjs(a.dateTo).diff(dayjs(a.dateFrom));

export const sortPointsByPrice = (a, b) => b.basePrice - a.basePrice;

export const replaceString = (string) => string.replace(/\s/g, '-');

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
