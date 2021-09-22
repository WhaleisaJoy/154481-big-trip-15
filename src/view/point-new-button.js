import AbstractView from './abstract';

const createPointNewButtonTemplate = () => (
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
    New event
  </button>`
);

export default class PointNewButton extends AbstractView {
  constructor() {
    super();

    this._newPointClickHandler = this._newPointClickHandler.bind(this);
  }

  getTemplate() {
    return createPointNewButtonTemplate();
  }

  setNewPointClickHandler(callback) {
    this._callback.newPointClick = callback;
    this.getElement().addEventListener('click', this._newPointClickHandler);
  }

  _newPointClickHandler(evt) {
    evt.preventDefault();
    this._callback.newPointClick();
  }
}
