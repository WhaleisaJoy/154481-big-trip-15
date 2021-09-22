import AbstractView from './abstract';
import { replace } from '../utils/render';

export default class Smart extends AbstractView {
  constructor() {
    super();

    this._data = {};
  }

  updateData(updatedData, justDataUpdating) {
    if (!updatedData) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      updatedData,
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    this.removeElement();

    const newElement = this.getElement();

    replace(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
