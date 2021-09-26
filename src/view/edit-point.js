import SmartView from './smart';
import { TYPES } from '../const';
import { replaceString } from '../utils/common';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import he from 'he';

const DATEPICKER_CONFIG = {
  'defaultDate': null,
  'dateFormat': 'y/m/d H:i',
  'enableTime': true,
  'time_24hr': true,
  'onChange': null,
};

const createTypeTemplate = (type, isDisabled) => {
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
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${typeItems}
        </fieldset>
      </div>
    </div>`;
};

const createDestinationTemplate = (type, destination, destinationsData, isDisabled) => {
  const destinationOptions = [...destinationsData.keys()].map((destinationData) => `<option value="${destinationData}"></option>`).join('');

  return `
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
      </label>
      <input
      class="event__input  event__input--destination"
      id="event-destination-1"
      type="text"
      name="event-destination"
      value="${he.encode(destination.name)}"
      list="destination-list-1"
      ${isDisabled ? 'disabled' : ''}>
      <datalist id="destination-list-1">
        ${destinationOptions}
      </datalist>
    </div>`;
};

const createTimeTemplate = (dateFrom, dateTo, isDisabled) => {
  const dateFromValue =  dayjs(dateFrom).format('YY/MM/DD HH:mm');
  const dateToValue =  dayjs(dateTo).format('YY/MM/DD HH:mm');

  return `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>

    <input
    class="event__input  event__input--time"
    id="event-start-time-1"
    type="text"
    name="event-start-time"
    value="${dateFromValue}"
    ${isDisabled ? 'disabled' : ''}>

    &mdash;

    <label class="visually-hidden" for="event-end-time-1">To</label>

    <input
    class="event__input  event__input--time"
    id="event-end-time-1"
    type="text"
    name="event-end-time"
    value="${dateToValue}"
    ${isDisabled ? 'disabled' : ''}>
  </div>`;
};

const createOffersTemplate = (selectedOffers, availableOffers, isDisabled) => {
  const offers = availableOffers.map((availableOffer) => {
    const selectedOffersTitles = selectedOffers && selectedOffers.map((offer) => offer.title);
    const isOfferChecked = selectedOffersTitles && selectedOffersTitles.includes(availableOffer.title);

    const offerName = replaceString(availableOffer.title.toLowerCase());

    return `<div
    class="event__offer-selector">
      <input
      class="event__offer-checkbox  visually-hidden"
      id="event-offer-${offerName}-1"
      type="checkbox"
      name="event-offer-${offerName}"
      ${isOfferChecked ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${offerName}-1">
        <span class="event__offer-title">${availableOffer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${availableOffer.price}</span>
      </label>
    </div>`;
  }).join('');

  return `<section
    class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers}
      </div>
    </section>`;
};

const createDestinationDescriptionTemplate = (destination) => {
  const pictures = destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures}
      </div>
    </div>
  </section>`;
};


const createEditPointTemplate = (data, offersData, destinationsData) => {
  const { dateFrom, dateTo, type, destination, basePrice, offers, isDestination, isNew, isDisabled, isSaving, isDeleting } = data;

  const availableOffersByType = offersData.get(type).offers;

  let resetButtonText = 'Delete';

  if (isNew) {
    resetButtonText = 'Cancel';
  } else if (isDeleting) {
    resetButtonText = 'Deleting';
  }

  const typeTemplate = createTypeTemplate(type, isDisabled);
  const destinationTemplate = createDestinationTemplate(type, destination, destinationsData, isDisabled);
  const timeTemplate = createTimeTemplate(dateFrom, dateTo, isDisabled);
  const offersTemplate = (availableOffersByType && availableOffersByType.length)
    ? createOffersTemplate(offers, availableOffersByType, isDisabled)
    : '';
  const destinationDescriptionTemplate = isDestination
    ? createDestinationDescriptionTemplate(destination)
    : '';

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
          <input
          class="event__input  event__input--price"
          id="event-price-1"
          type="number"
          name="event-price"
          value="${basePrice}"
          ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">
          ${isSaving ? 'Saving...' : 'Save'}
        </button>

        <button class="event__reset-btn" type="reset">
          ${resetButtonText}
        </button>

        ${isNew ? '' : `<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`}

      </header>
      <section class="event__details">

        ${offersTemplate}
        ${destinationDescriptionTemplate}

      </section>
    </form>
  </li>`;
};

export default class EditPoint extends SmartView {
  constructor(point, offers, destinations) {
    super();
    this._data = EditPoint.parsePointToData(point);
    this._offersData = offers;
    this._destinationsData = destinations;
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
    this._offersChangeHandler = this._offersChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  getTemplate() {
    return createEditPointTemplate(this._data, this._offersData, this._destinationsData);
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

    if (!this._data.isNew) {
      this.setCloseEditFormHandler(this._callback.closeEditForm);
    }

    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setDatePicker();
  }

  _setDatePicker() {
    this._destroyDatePicker();

    const startDateElement = this.getElement().querySelector('#event-start-time-1');
    const endDateElement = this.getElement().querySelector('#event-end-time-1');

    this._startDatePicker = flatpickr(
      startDateElement,
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
      endDateElement,
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

    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const name = evt.target.value;
    const destinationNames = [...this._destinationsData.keys()];

    if (destinationNames.includes(name)) {
      const destination = this._destinationsData.get(name);
      const description = destination.description;
      const pictures = destination.pictures;

      this.updateData({
        destination: {
          name,
          description,
          pictures,
        },
        isDestination: description.length > 0,
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
      basePrice: parseInt(evt.target.value, 10),
    }, true);
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();

    const parentElement = evt.target.closest('.event__offer-selector');
    const choosenOfferType = this._data.type;
    const choosenOfferTitle = parentElement.querySelector('.event__offer-title').innerText;
    const availableOffersByType = this._offersData.get(choosenOfferType).offers;
    const choosenOffer = availableOffersByType.find((offer) => offer.title === choosenOfferTitle);
    const isChecked = evt.target.checked;

    if (!this._data.offers) {
      this._data.offers = [];
    }

    const currentOffers = this._data.offers.slice();

    if (isChecked) {
      this._data.offers.push(choosenOffer);
    } else {
      this._data.offers = currentOffers.filter((offer) => offer.title !== choosenOfferTitle);
    }

    this.updateData({
      offers: this._data.offers.slice(),
    });
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

    const offersDataByType = this._offersData.get(this._data.type).offers;

    if (offersDataByType && offersDataByType.length) {
      this
        .getElement()
        .querySelector('.event__available-offers')
        .addEventListener('change', this._offersChangeHandler);
    }
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
        isDestination: point.destination.description !== null,
        isNew: !point.id,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    if (!data.isDestination) {
      data.destination.description = null;
    }

    delete data.isDestination;
    delete data.isNew;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
