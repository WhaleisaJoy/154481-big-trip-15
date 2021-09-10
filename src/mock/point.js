import { getRandomInteger } from '../utils/common';
import { generateDestination } from './destination';
import { generateOffers } from './offer';
import { TYPES } from '../const';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const generateFromDate = () => {
  const maxGap = 60000 * 60 *24 * 7;
  const gap = getRandomInteger(-maxGap, maxGap);

  return dayjs().add(gap, 'ms');
};

const generateToDate = (dateFrom) => {
  const durationOptions = [
    {
      //lessThanHour
      minGap: 15,
      maxGap: 60,
    },
    {
      //lessThanOneDay
      minGap: 61,
      maxGap: 60 * 24,
    },
    {
      //moreThanOneDay
      minGap: 60 * 24 + 1,
      maxGap: 60 * 24 * 3 + 1,
    },
  ];

  const randomOption = getRandomInteger(0, durationOptions.length - 1);
  const gap = getRandomInteger(durationOptions[randomOption].minGap, durationOptions[randomOption].maxGap);

  return dayjs(dateFrom).add(gap, 'minute');
};

const generateType = () => {
  const randomType = getRandomInteger(0, TYPES.length - 1);

  return TYPES[randomType];
};

const generatePrice = () => getRandomInteger(10, 500);


export const generatePoint = () => {
  const type = generateType();
  const dateFrom = generateFromDate();
  const dateTo = generateToDate(dateFrom);

  return {
    id: nanoid(),
    dateFrom,
    dateTo,
    type,
    destination: generateDestination(),
    basePrice: generatePrice(),
    offers: generateOffers(type),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
