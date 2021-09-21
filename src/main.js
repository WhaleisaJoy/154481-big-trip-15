import TripControlsView from './view/trip-controls';
import MenuView from './view/menu';
import StatisticsView from './view/statistics';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
// import { generatePoint } from './mock/point';
import { RenderPosition, render, remove } from './utils/render';
// import { sortPointsByDay } from './utils/common';
import { MenuItem, UpdateType } from './const';
import Api from './api';

// const POINTS_COUNT = 15;
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic mn7fo4heYndp9du6b';

const tripMain = document.querySelector('.trip-main');
const pageMainBodyContainer = document.querySelector('.page-main .page-body__container');
const tripEvents = document.querySelector('.trip-events');

// const points = new Array(POINTS_COUNT).fill().map(generatePoint);
// const sortedPoints = points.sort(sortPointsByDay);
const api = new Api(END_POINT, AUTHORIZATION);

// api.getPoints().then((points) => {
//   console.log(points);
// });

const pointsModel = new PointsModel();
// pointsModel.setPoints(sortedPoints);

const filterModel = new FilterModel();


const TripControlsComponent = new TripControlsView();
const SiteMenuComponent = new MenuView();
render(tripMain, TripControlsComponent, RenderPosition.AFTERBEGIN);
render(TripControlsComponent, SiteMenuComponent, RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripMain, tripEvents, pointsModel, filterModel, api);
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

api.getPoints()
  .then((points) => {
    //console.log(points);
    // console.log('setPoints');
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });
