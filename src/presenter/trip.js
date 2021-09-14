import TripInfoView from '../view/trip-info';
import SortView from '../view/sort';
import TripEventsListView from '../view/trip-events-list';
import NoPointView from '../view/no-point';
import PointPresenter from './point';
import { RenderPosition, render, remove } from '../utils/render';
import { updateItem, sortPointsByDay, sortPointsByTime, sortPointsByPrice } from '../utils/common';
import { SortType, UserActionType, UpdateType } from '../const';

export default class Trip {
  constructor(tripMainContainer, tripEventsContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._tripMainContainer = tripMainContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY;

    this._sortComponent = null;

    this._pointListComponent = new TripEventsListView();
    this._noPointComponent = new NoPointView();

    //this._handlePointChange = this._handlePointChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePointModeChange = this._handlePointModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._points = this._getPoints().slice();

    this._renderTrip();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._pointsModel.getPoints().slice().sort(sortPointsByTime);
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort(sortPointsByPrice);
    }

    return this._pointsModel.getPoints();
  }

  // _handlePointChange(updatedPoint) {
  //   //this._points = updateItem(this._points, updatedPoint);
  //   this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  // }

  _handleViewAction(actionType, updateType, update) {
    //console.log(actionType, updateType, update);
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
    //console.log(updateType, data);
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
    this._pointPresenter.forEach((presenter) => presenter.resetMode());
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    // this._sortPoints(sortType);
    // this._clearPointList();
    // this._renderPoints();

    this._clearTrip();
    this._renderTrip();
  }

  // _sortPoints(sortType) {
  //   switch (sortType) {
  //     case SortType.TIME:
  //       this._points.sort(sortPointsByTime);
  //       break;
  //     case SortType.PRICE:
  //       this._points.sort(sortPointsByPrice);
  //       break;
  //     default:
  //       this._points.sort(sortPointsByDay);
  //   }

  //   this._currentSortType = sortType;
  // }

  _clearPointList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._getPoints());
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

    this._renderTripInfo();
    this._renderSort();
    this._renderPointList();
    this._renderPoints();
  }

  _clearTrip({resetSortType = false} = {}) {
    this._clearPointList();

    remove(this._tripInfoComponent);
    remove(this._sortComponent);
    remove(this._noPointComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }
}
