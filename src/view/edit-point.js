import SmartView from './smart';
import { TYPES, DESTINATIONS } from '../const';
import { generateOffers } from '../mock/offer';
import { generateDestination } from '../mock/destination';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import he from 'he';


const EMPTY_POINT = {
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  type: TYPES[0],
  destination: {
    name: '',
    description: '',
    pics: '',
  },
  basePrice: '',
  offers: null,
  isFavorite: false,
};

const DATEPICKER_CONFIG = {
  defaultDate: null,
  dateFormat: 'y/m/d H:i',
  enableTime: true,
  // eslint-disable-next-line camelcase
  time_24hr: true,
  onChange: null,
};

const createTypeTemplate = (type) => {
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
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
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

const createDestinationTemplate = (type, destination) => {
  const destinationOptions = DESTINATIONS.map((destinationItem) => `<option value="${destinationItem}"></option>`).join('');

  return `
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-1">
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


const createEditPointTemplate = (data) => {
  const { dateFrom, dateTo, type, destination, basePrice, offers, isOffers, isDestination } = data;

  const typeTemplate = createTypeTemplate(type);
  const destinationTemplate = createDestinationTemplate(type, destination);

  const timeTemplate = createTimeTemplate(dateFrom, dateTo);

  const offersTemplate = isOffers ? createOffersTemplate(offers) : '';

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
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
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

export default class EditPoint extends SmartView {
  constructor(point = EMPTY_POINT) {
    super();
    this._data = EditPoint.parsePointToData(point);
    this._startDatePicker = null;
    this._endDatePicker = null;

    this._closeEditFormHandler = this._closeEditFormHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  removeElement() {
    super.removeElement();

    this._destroyDatePicker();
  }

  reset(point) {
    this.updateData(
      EditPoint.parsePointToData(point),
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseEditFormHandler(this._callback.closeEditForm);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setDatePicker();
  }

  _setDatePicker() {
    this._destroyDatePicker();

    const startDate = this.getElement().querySelector('#event-start-time-1');
    const endDate = this.getElement().querySelector('#event-end-time-1');

    this._startDatePicker = flatpickr(
      startDate,
      Object.assign(
        {},
        DATEPICKER_CONFIG,
        {
          defaultDate: this._data.dateFrom,
          onChange: this._startDateChangeHandler,
        },
      ),
    );

    this._endDatePicker = flatpickr(
      endDate,
      Object.assign(
        {},
        DATEPICKER_CONFIG,
        {
          defaultDate: this._data.dateTo,
          minDate: this._data.dateFrom,
          onChange: this._endDateChangeHandler,
        },
      ),
    );
  }

  _destroyDatePicker() {
    if (this._startDatePicker || this._endDatePicker) {
      this._startDatePicker.destroy();
      this._endDatePicker.destroy();
      this._startDatePicker = null;
      this._endDatePicker = null;
    }
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    const type = evt.target.value;
    const offers = generateOffers(type);

    this.updateData({
      type,
      offers,
      isOffers: offers !== null,
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const name = evt.target.value;

    if (DESTINATIONS.includes(name)) {
      const destination = generateDestination();
      const description = destination.description;
      const pics = destination.pics;

      this.updateData({
        destination: {
          name,
          description,
          pics,
        },
      });
    } else {
      evt.target.setCustomValidity('Incorrect value');
      evt.target.reportValidity();
    }
  }

  _startDateChangeHandler([userData]) {
    this.updateData({
      dateFrom: userData,
    });

    if (userData > this._data.dateTo) {
      this.updateData({
        dateTo: userData,
      });
    }
  }

  _endDateChangeHandler([userData]) {
    this.updateData({
      dateTo: userData,
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value,
    }, true);
  }

  _setInnerHandlers() {
    this
      .getElement()
      .querySelector('.event__type-list')
      .addEventListener('input', this._typeChangeHandler);

    this
      .getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationChangeHandler);

    this
      .getElement()
      .querySelector('.event__input--price')
      .addEventListener('input', this._priceInputHandler);
  }

  _closeEditFormHandler(evt) {
    evt.preventDefault();
    this._callback.closeEditForm();
  }

  setCloseEditFormHandler(callback) {
    this._callback.closeEditForm = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeEditFormHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditPoint.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditPoint.parseDataToPoint(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deleteClickHandler);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        isOffers: point.offers !== null,
        isDestination: point.destination.description,
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    if (!data.isOffers) {
      data.offers = null;
    }

    if (!data.isDestination) {
      data.destination.description = null;
    }

    delete data.isOffers;
    delete data.isDestination;

    return data;
  }
}
