import TripInfoView from './view/trip-info';
import MenuView from './view/menu';
import FiltersView from './view/filters';
import SortView from './view/sort';
import TripEventsListView from './view/trip-events-list';
import PointView from './view/point';
import EditPointView from './view/edit-point';
import NoPointView from './view/no-point';
import { generatePoint } from './mock/point';
import { RenderPosition, render, replace } from './utils/render';

const POINTS_COUNT = 15;

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const sortPoints = (a, b) => a.dateFrom - b.dateFrom;
const sortedPoints = points.sort(sortPoints);

const renderPoint = (tripEventsListElement, point) => {
  const pointComponent = new PointView(point);
  const EditPointComponent = new EditPointView(point);

  const replacePointToForm = () => replace(EditPointComponent, pointComponent);
  const replaceFormToPoint = () => replace(pointComponent, EditPointComponent);

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const openEditPointForm = () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  };

  const closeEditPointForm = () => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  };

  pointComponent.setClickHandler(openEditPointForm);

  EditPointComponent.setFormSubmitHandler(closeEditPointForm);
  EditPointComponent.setClickHandler(closeEditPointForm);

  render(tripEventsListElement, pointComponent, RenderPosition.BEFOREEND);
};

const pageHeader = document.querySelector('.page-header');
const tripMain = pageHeader.querySelector('.trip-main');
const tripControlsNavigation = pageHeader.querySelector('.trip-controls__navigation');
const tripControlsFilter = pageHeader.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');

const renderPageBody = () => {
  render(tripControlsNavigation, new MenuView(), RenderPosition.BEFOREEND);
  render(tripControlsFilter, new FiltersView(), RenderPosition.BEFOREEND);

  if (points.length === 0) {
    render(tripEvents, new NoPointView(), RenderPosition.BEFOREEND);
    return;
  }

  render(tripMain, new TripInfoView(sortedPoints), RenderPosition.AFTERBEGIN);
  render(tripEvents, new SortView(), RenderPosition.BEFOREEND);

  const tripEventsListComponent = new TripEventsListView();
  render(tripEvents, tripEventsListComponent, RenderPosition.BEFOREEND);

  for (let i = 0; i < POINTS_COUNT; i++) {
    renderPoint(tripEventsListComponent, sortedPoints[i]);
  }
};

renderPageBody();
