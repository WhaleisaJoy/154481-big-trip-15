import AbstractObserver from '../utils/abstract-observer';

export default class Destinations extends AbstractObserver {
  constructor() {
    super();
    this._destinations = new Map();
  }

  setDestinations(destinations) {
    destinations.forEach((destination) => this._destinations.set(destination.name, destination));
  }

  getDestinations() {
    return this._destinations;
  }
}
