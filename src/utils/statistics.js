import { TYPES } from '../const';

const filterPointsByType = (points, type) => points.filter((point) => point.type === type);

const reducer = (accumulator, currentValue) => accumulator + currentValue;

export const countTotalPriceByType = (points) => (
  TYPES.map((type) => {
    const pointsByType = filterPointsByType(points, type);

    if (pointsByType.length === 0) {
      return 0;
    }

    return pointsByType
      .map((point) => +point.basePrice)
      .reduce(reducer);
  })
);

export const countUsesByType = (points) => TYPES.map((type) => filterPointsByType(points, type).length);

export const countTimeSpendByType = (points) => (
  TYPES.map((type) => {
    const pointsByType = filterPointsByType(points, type);

    if (pointsByType.length === 0) {
      return 0;
    }

    return pointsByType
      .map((point) => point.dateTo - point.dateFrom)
      .reduce(reducer);
  })
);

export const formatTimeSpendDuration = (timeSpend) => {
  const minutes = Math.floor( (timeSpend / (1000 * 60)) % 60 );
  const hours = Math.floor( (timeSpend / (1000 * 60 * 60)) % 24 );
  const days = Math.floor( (timeSpend / (1000 * 60 * 60 * 24)) % 30 );

  const dateMinutes = minutes !== 0 ? `${minutes}M` : '';
  const dateHours = hours !== 0 ? `${hours}H` : '';
  const dateDays = days !== 0 ? `${days}D` : '';

  return `${dateDays} ${dateHours} ${dateMinutes}`;
};

export const sortCountDown = (a, b) => b - a;

