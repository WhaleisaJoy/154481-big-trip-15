import AbstractView from './abstract';
import dayjs from 'dayjs';

const createRouteTemplate = (points) => {
  const destinationNames = points.map((point) => point.destination.name);

  const reducer = (accumulator, currentValue) => `${accumulator  } &mdash; ${  currentValue}`;

  const tripRoute = destinationNames.length > 3
    ? `${destinationNames[0]} &mdash; ... &mdash; ${destinationNames[destinationNames.length - 1]}`
    : destinationNames.reduce(reducer);

  return tripRoute;
};

const createDatesTemplate = (points) => {
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  const startDate = dayjs(firstPoint.dateFrom).format('MMM DD');
  const endDate = dayjs(lastPoint.dateFrom).isSame(dayjs(firstPoint.dateFrom), 'month')
    ? dayjs(lastPoint.dateFrom).format('DD')
    : dayjs(lastPoint.dateFrom).format('MMM DD');

  return {startDate, endDate};
};

const createCostValueTemplate = (points) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  const prices = points.map((point) => point.basePrice);
  const costValue = prices.reduce(reducer);

  return costValue;
};

const createTripInfoTemplate = (points) => {
  const route = createRouteTemplate(points);
  const dates = createDatesTemplate(points);
  const costValue = createCostValueTemplate(points);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${route}</h1>

      <p class="trip-info__dates">${dates.startDate}&nbsp;&mdash;&nbsp;${dates.endDate}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${costValue}</span>
    </p>
  </section>`;
};

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}
