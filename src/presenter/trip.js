import TripInfoView from '../view/trip-info';
import SortView from '../view/sort';
import TripEventsListView from '../view/trip-events-list';
import NoPointView from '../view/no-point';
import PointPresenter from './point';
import { RenderPosition, render } from '../utils/render';
import { updateItem } from '../utils/common';

export default class Trip {
  constructor(tripMainContainer, tripEventsContainer, sortedPoints) {
    this._tripMainContainer = tripMainContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._sortedPoints = sortedPoints;
    this._pointPresenter = new Map();

    this._tripInfoComponent = new TripInfoView(this._sortedPoints);
    this._sortComponent = new SortView();
    this._pointListComponent = new TripEventsListView();
    this._noPointComponent = new NoPointView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handlePointModeChange = this._handlePointModeChange.bind(this);
  }

  init() {
    this._renderTrip();
  }

  _handlePointChange(updatedPoint) {
    this._sortedPoints = updateItem(this._sortedPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handlePointModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetMode());
  }

  _renderTripInfo() {
    render(this._tripMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoint() {
    render(this._tripEventsContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderPointList() {
    render(this._tripEventsContainer, this._pointListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoints() {
    for (const sortedPoint of this._sortedPoints ) {
      this._renderPoint(sortedPoint);
    }
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handlePointModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderTrip() {
    if (this._sortedPoints.length === 0) {
      this._renderNoPoint();
      return;
    }

    this._renderTripInfo();
    this._renderSort();
    this._renderPointList();
    this._renderPoints();
  }
}
