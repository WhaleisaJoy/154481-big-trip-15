import AbstractView from './abstract';
import dayjs from 'dayjs';
import { formatTimeSpendDuration } from '../utils/statistics';

const createOffersListTemplate = (offers) => {
  const offersListItems = offers.map((offer) => `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`,
  ).join('');

  return `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offersListItems}
    </ul>`;
};

const getDateDifference = (dateFrom, dateTo) => {
  const dateDuration = dayjs(dateTo).diff(dayjs(dateFrom));

  return formatTimeSpendDuration(dayjs(dateDuration));
};


const createPointTemplate = (point) => {
  const { dateFrom, dateTo, type, destination, basePrice, offers, isFavorite } = point;

  const favoriteClassName = isFavorite ? 'event__favorite-btn event__favorite-btn--active' : 'event__favorite-btn';
  const offersList = offers !== null ? createOffersListTemplate(offers) : '';
  const date = dayjs(dateFrom).format('MMM D');
  const dateTime = dayjs(dateFrom).format('YYYY-MM-D');
  const dateStartTime = dayjs(dateFrom).format('HH:mm');
  const dateEndTime = dayjs(dateTo).format('HH:mm');
  const eventDuration = getDateDifference(dateFrom, dateTo);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateTime}">${date}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${dateStartTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${dateEndTime}</time>
        </p>
        <p class="event__duration">${eventDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      ${offersList}
      <button class="${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._openPointEditHandler = this._openPointEditHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  _openPointEditHandler(evt) {
    evt.preventDefault();
    this._callback.openPointEdit();
  }

  setOpenPointEditHandler(callback) {
    this._callback.openPointEdit = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._openPointEditHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}
