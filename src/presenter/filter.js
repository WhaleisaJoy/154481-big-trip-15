import { FilterType, UpdateType } from '../const';
import FiltersView from '../view/filters';
import { render, RenderPosition, remove, replace } from '../utils/render';
import { filter } from '../utils/filter';

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        amount: filter[FilterType.EVERYTHING](points).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        amount: filter[FilterType.FUTURE](points).length,
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        amount: filter[FilterType.PAST](points).length,
      },
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
