import TripControlsView from './view/trip-controls';
import MenuView from './view/menu';
import FiltersView from './view/filters';
import Trip from './presenter/trip';
import { generatePoint } from './mock/point';
import { RenderPosition, render } from './utils/render';

const POINTS_COUNT = 15;

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const sortPoints = (a, b) => a.dateFrom - b.dateFrom;
const sortedPoints = points.sort(sortPoints);

const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');

const TripControlsComponent = new TripControlsView();
render(tripMain, TripControlsComponent, RenderPosition.AFTERBEGIN);
render(TripControlsComponent, new MenuView(), RenderPosition.BEFOREEND);
render(TripControlsComponent, new FiltersView(), RenderPosition.BEFOREEND);

const tripPresenter = new Trip(tripMain, tripEvents, sortedPoints);
tripPresenter.init();
