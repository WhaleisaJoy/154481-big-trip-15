import dayjs from 'dayjs';
import { FilterType } from '../const';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => point.dateFrom > dayjs()),
  [FilterType.PAST]: (points) => points.filter((point) => point.dateFrom < dayjs()),
};

