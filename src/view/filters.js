import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name } = filter;

  return (
    `<div class="trip-filters__filter">
      <input
      id="filter-${type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${type === currentFilterType ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
    </div>`
  );
};

const createFilterTemplate = (filters, currentFilterType) => {
  const filterItems = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return `<div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${filterItems}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`;
};


export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.parentElement.querySelector('.trip-filters__filter-input').value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
