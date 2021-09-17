import TripControlsView from './view/trip-controls';
import MenuView from './view/menu';
import StatisticsView from './view/statistics';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import { generatePoint } from './mock/point';
import { RenderPosition, render, remove } from './utils/render';
import { sortPointsByDay } from './utils/common';
import { MenuItem } from './const';

const POINTS_COUNT = 15;

const points = new Array(POINTS_COUNT).fill().map(generatePoint);

const sortedPoints = points.sort(sortPointsByDay);

const pointsModel = new PointsModel();
pointsModel.setPoints(sortedPoints);

const filterModel = new FilterModel();

const tripMain = document.querySelector('.trip-main');
const pageMainBodyContainer = document.querySelector('.page-main .page-body__container');
const tripEvents = document.querySelector('.trip-events');

const TripControlsComponent = new TripControlsView();
const SiteMenuComponent = new MenuView();
render(tripMain, TripControlsComponent, RenderPosition.AFTERBEGIN);
render(TripControlsComponent, SiteMenuComponent, RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripMain, tripEvents, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(TripControlsComponent, filterModel, pointsModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      SiteMenuComponent.setMenuItem(menuItem);
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      SiteMenuComponent.setMenuItem(menuItem);
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pageMainBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

SiteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

tripPresenter.init();
filterPresenter.init();

tripMain.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createNewPoint();
});
