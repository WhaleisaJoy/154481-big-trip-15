import AbstractView from './abstract';
import { FilterType } from '../const';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createNoPointTemplate = (activeFilterType) => (
  `<p class="trip-events__msg">
    ${NoPointsTextType[activeFilterType]}
  </p>`
);

export default class NoPoint extends AbstractView {
  constructor(activeFilterType) {
    super();

    this._activeFilterType = activeFilterType;
  }

  getTemplate() {
    return createNoPointTemplate(this._activeFilterType);
  }
}
