import TripControlsView from './view/trip-controls';
import MenuView from './view/menu';
// import FiltersView from './view/filters';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import { generatePoint } from './mock/point';
import { RenderPosition, render } from './utils/render';
import { sortPointsByDay } from './utils/common';

const POINTS_COUNT = 15;

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const sortedPoints = points.sort(sortPointsByDay);

const pointsModel = new PointsModel();
pointsModel.setPoints(sortedPoints);

const filterModel = new FilterModel();

const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');

const TripControlsComponent = new TripControlsView();
render(tripMain, TripControlsComponent, RenderPosition.AFTERBEGIN);
render(TripControlsComponent, new MenuView(), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripMain, tripEvents, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(TripControlsComponent, filterModel, pointsModel);

tripPresenter.init();
filterPresenter.init();

tripMain.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createNewPoint();
});
