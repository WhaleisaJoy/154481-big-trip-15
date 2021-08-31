import dayjs from 'dayjs';

export const getTripDates = (points) => {
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  const startDate = dayjs(firstPoint.dateFrom).format('MMM DD');
  const endDate = dayjs(lastPoint.dateFrom).isSame(dayjs(firstPoint.dateFrom), 'month')
    ? dayjs(lastPoint.dateFrom).format('DD')
    : dayjs(lastPoint.dateFrom).format('MMM DD');

  return {startDate, endDate};
};
