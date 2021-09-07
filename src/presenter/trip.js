import TripInfoView from '../view/trip-info';
import SortView from '../view/sort';
import TripEventsListView from '../view/trip-events-list';
import NoPointView from '../view/no-point';
import PointPresenter from './point';
import { RenderPosition, render } from '../utils/render';
import { updateItem, sortPointsByDay, sortPointsByTime, sortPointsByPrice } from '../utils/common';
import { SortType } from '../const';

export default class Trip {
  constructor(tripMainContainer, tripEventsContainer) {
    this._tripMainContainer = tripMainContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY;

    this._sortComponent = new SortView();
    this._pointListComponent = new TripEventsListView();
    this._noPointComponent = new NoPointView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handlePointModeChange = this._handlePointModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._sorcedPoints = points.slice();

    this._renderTrip();
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handlePointModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetMode());
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPointList();
    this._renderPoints();
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._points.sort(sortPointsByTime);
        break;
      case SortType.PRICE:
        this._points.sort(sortPointsByPrice);
        break;
      default:
        this._points.sort(sortPointsByDay);
    }

    this._currentSortType = sortType;
  }

  _clearPointList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._points);
    render(this._tripMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoPoint() {
    render(this._tripEventsContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderPointList() {
    render(this._tripEventsContainer, this._pointListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoints() {
    for (const sortedPoint of this._points ) {
      this._renderPoint(sortedPoint);
    }
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handlePointModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderTrip() {
    if (this._points.length === 0) {
      this._renderNoPoint();
      return;
    }

    this._renderTripInfo();
    this._renderSort();
    this._renderPointList();
    this._renderPoints();
  }
}
