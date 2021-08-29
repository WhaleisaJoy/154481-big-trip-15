import { createElement } from '../utils';
import { TYPES } from '../const';
import dayjs from 'dayjs';
import { getRandomInteger } from '../utils';

const createTypeTemplate = (point) => {
  const { icon, type } = point;

  const typeItems = TYPES.map((typeItem) => `<div
    class="event__type-item">
      <input id="event-type-${typeItem}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeItem}" ${typeItem ===  type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${typeItem}" for="event-type-${typeItem}-1">${typeItem}</label>
    </div>`,
  ).join('');

  return `
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${icon}" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${typeItems}
        </fieldset>
      </div>
    </div>`;
};

const createDestinationTemplate = (point) => {
  const { type, destination } = point;
  const destinationOptions = TYPES.map((typeItem) => `<option value="${typeItem}"></option>`).join('');

  return `
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${destinationOptions}
      </datalist>
    </div>`;
};

const createTimeTemplate = (dateFrom, dateTo) => {
  const dateFromValue =  dayjs(dateFrom).format('YY/MM/DD HH:mm');
  const dateToValue =  dayjs(dateTo).format('YY/MM/DD HH:mm');

  return `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromValue}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToValue}">
  </div>`;
};

const createOffersTemplate = (offers) => {
  const availableOffers = offers.map((offer) => `<div
    class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-1" type="checkbox" name="event-offer-${offer.name}" checked>
      <label class="event__offer-label" for="event-offer-${offer.name}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join('');

  return `<section
    class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${availableOffers}
      </div>
    </section>`;
};

const createDestinationDescriptionTemplate = (destination) => {
  const images = destination.pics.map((pic) => `<img class="event__photo" src="${pic}" alt="Event photo">`).join('');

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${images}
      </div>
    </div>
  </section>`;
};


const createEditPointTemplate = (point) => {
  const { dateFrom, dateTo, destination, basePrice, offers } = point;

  const typeTemplate = createTypeTemplate(point);
  const destinationTemplate = createDestinationTemplate(point);

  const timeTemplate = createTimeTemplate(dateFrom, dateTo);

  const offersTemplate = offers.length ? createOffersTemplate(offers) : '';

  const isDestination = Boolean(getRandomInteger(0, 1));
  const destinationDescriptionTemplate = isDestination ? createDestinationDescriptionTemplate(destination) : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">

        ${typeTemplate}
        ${destinationTemplate}
        ${timeTemplate}

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">

        ${offersTemplate}
        ${destinationDescriptionTemplate}

      </section>
    </form>
  </li>`;
};

export default class EditPoint {
  constructor(point) {
    this._point = point;
    this._element = null;
  }

  getTemplate() {
    return createEditPointTemplate(this._point);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
