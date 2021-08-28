import TripInfoView from './view/trip-info';
import MenuView from './view/menu';
import FiltersView from './view/filters';
import SortView from './view/sort';
import TripEventsListView from './view/trip-events-list';
import PointView from './view/point';
import EditPointView from './view/edit-point';
import {generatePoint} from './mock/point';

import { RenderPosition, render } from './utils';

const POINTS_COUNT = 15;

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const sortPoints = (a, b) => a.dateFrom - b.dateFrom;
const sortedPoints = points.sort(sortPoints);

const renderPoint = (tripEventsListElement, point) => {
  const pointComponent = new PointView(point);
  const EditPointComponent = new EditPointView(point);

  const replacePointToForm = () => {
    tripEventsListElement.replaceChild(EditPointComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    tripEventsListElement.replaceChild(pointComponent.getElement(), EditPointComponent.getElement());
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
  });

  EditPointComponent.getElement().querySelector('.event--edit').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
  });

  render(tripEventsListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const pageHeader = document.querySelector('.page-header');
const tripMain = pageHeader.querySelector('.trip-main');
const tripControlsNaviation = pageHeader.querySelector('.trip-controls__navigation');
const tripControlsFilter = pageHeader.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');

render(tripMain, new TripInfoView(sortedPoints).getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsNaviation, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(tripControlsFilter, new FiltersView().getElement(), RenderPosition.BEFOREEND);
render(tripEvents, new SortView().getElement(), RenderPosition.BEFOREEND);

const tripEventsListComponent = new TripEventsListView();
render(tripEvents, tripEventsListComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < POINTS_COUNT; i++) {
  renderPoint(tripEventsListComponent.getElement(), sortedPoints[i]);
}

