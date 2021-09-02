import TripInfoView from '../view/trip-info';
import SortView from '../view/sort';
import TripEventsListView from '../view/trip-events-list';
import NoPointView from '../view/no-point';
import PointPresenter from './point';
import { RenderPosition, render } from '../utils/render';

export default class Trip {
  constructor(tripMainContainer, tripEventsContainer, sortedPoints) {
    this._tripMainContainer = tripMainContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._sortedPoints = sortedPoints;

    this._tripInfoComponent = new TripInfoView(this._sortedPoints);
    this._sortComponent = new SortView();
    this._pointListComponent = new TripEventsListView();
    this._noPointComponent = new NoPointView();
  }

  init() {
    this._renderTrip();
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
    const pointPresenter = new PointPresenter(this._pointListComponent);
    pointPresenter.init(point);
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
