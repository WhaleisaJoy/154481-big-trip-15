import TripControlsView from './view/trip-controls';
import MenuView from './view/menu';
import FiltersView from './view/filters';
import TripPresenter from './presenter/trip';
import Points from './model/points';
import { generatePoint } from './mock/point';
import { RenderPosition, render } from './utils/render';

import { sortPointsByDay } from './utils/common';

const POINTS_COUNT = 15;

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const sortedPoints = points.sort(sortPointsByDay);

const pointsModel = new Points();
pointsModel.setPoints(sortedPoints);

const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');

const TripControlsComponent = new TripControlsView();
render(tripMain, TripControlsComponent, RenderPosition.AFTERBEGIN);
render(TripControlsComponent, new MenuView(), RenderPosition.BEFOREEND);
render(TripControlsComponent, new FiltersView(), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripMain, tripEvents, pointsModel);
tripPresenter.init();
