import TripInfoView from '../view/trip-info';
import SortView from '../view/sort';
import TripEventsListView from '../view/trip-events-list';
import NoPointView from '../view/no-point';
import PointPresenter from './point';
import PointNewPresenter from './point-new';
import { RenderPosition, render, remove } from '../utils/render';
import { sortPointsByDay, sortPointsByTime, sortPointsByPrice } from '../utils/common';
import { SortType, UserActionType, UpdateType, FilterType } from '../const';
import { filter } from '../utils/filter';

export default class Trip {
  constructor(tripMainContainer, tripEventsContainer, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._tripMainContainer = tripMainContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._pointPresenter = new Map();
    this._activeFilterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.DAY;

    this._tripInfoComponent = null;
    this._sortComponent = null;
    this._noPointComponent = null;

    this._pointListComponent = new TripEventsListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePointModeChange = this._handlePointModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction);
  }

  init() {
    this._points = this._getPoints().slice();

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetTripInfo: false, resetSortType: true});

    remove(this._pointListComponent);

    this._pointsModel.deleteObserver(this._handleModelEvent);
    this._filterModel.deleteObserver(this._handleModelEvent);
  }

  createNewPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    this._activeFilterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[this._activeFilterType](points);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortPointsByDay);
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
    }

    return filteredPoints;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserActionType.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserActionType.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
      case UserActionType.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _handlePointModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetMode());
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _clearPointList() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._getPoints().slice().sort(sortPointsByDay));
    render(this._tripMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoint() {
    this._noPointComponent = new NoPointView(this._activeFilterType);
    render(this._tripEventsContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderPointList() {
    render(this._tripEventsContainer, this._pointListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoints() {
    for (const point of this._getPoints()) {
      this._renderPoint(point);
    }
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handlePointModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderTrip() {
    if (this._getPoints().length === 0) {
      this._renderNoPoint();
      return;
    }

    if (this._tripInfoComponent === null) {
      this._renderTripInfo();
    }

    this._renderSort();
    this._renderPointList();
    this._renderPoints();
  }

  _clearTrip({resetTripInfo = true, resetSortType = false} = {}) {
    this._clearPointList();

    if (resetTripInfo) {
      remove(this._tripInfoComponent);
      this._tripInfoComponent = null;
    }
    remove(this._sortComponent);

    if (this._noPointComponent) {
      remove(this._noPointComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }
}
