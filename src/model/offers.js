import AbstractObserver from '../utils/abstract-observer';

export default class Offers extends AbstractObserver {
  constructor() {
    super();
    this._offers = new Map();
  }

  setOffers(offers) {
    offers.forEach((offer) => this._offers.set(offer.type, offer));
  }

  getOffers() {
    return this._offers;
  }
}
