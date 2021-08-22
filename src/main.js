import { createTripInfoTemplate } from './view/trip-info';
import { createMenuTemplate } from './view/menu';
import { createFiltersTemplate } from './view/filters';
import { createSortTemplate } from './view/sort';
import { createTripEventsListTemplate } from './view/trip-events-list';
import { createPointTemplate } from './view/point';
import { createEditPointTemplate } from './view/edit-point';
import { generatePoint } from './mock/point';

const POINTS_COUNT = 15;

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const sortPoints = (a, b) => a.dateFrom - b.dateFrom;
const sortedPoints = points.sort(sortPoints);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeader = document.querySelector('.page-header');
const tripMain = pageHeader.querySelector('.trip-main');
const tripControlsNaviation = pageHeader.querySelector('.trip-controls__navigation');
const tripControlsFilter = pageHeader.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');

render(tripMain, createTripInfoTemplate(sortedPoints), 'afterbegin');
render(tripControlsNaviation, createMenuTemplate(), 'beforeend');
render(tripControlsFilter, createFiltersTemplate(), 'beforeend');
render(tripEvents, createSortTemplate(), 'beforeend');
render(tripEvents, createTripEventsListTemplate(), 'beforeend');

const tripEventsList = pageMain.querySelector('.trip-events__list');

render(tripEventsList, createEditPointTemplate(sortedPoints[0]), 'beforeend');

for (let i = 1; i < POINTS_COUNT; i++) {
  render(tripEventsList, createPointTemplate(sortedPoints[i]), 'beforeend');
}

