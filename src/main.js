import TripControlsView from './view/trip-controls';
import MenuView from './view/menu';
import PointNewButtonView from './view/point-new-button';
import StatisticsView from './view/statistics';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import FilterModel from './model/filter';
import { RenderPosition, render, remove } from './utils/render';
import { MenuItem, UpdateType, FilterType } from './const';
import Api from './api';

const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic mn7fo4heYndp9du6b';

const tripMainElement = document.querySelector('.trip-main');
const pageMainBodyContainerElement = document.querySelector('.page-main .page-body__container');
const tripEventsElement = document.querySelector('.trip-events');

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const TripControlsComponent = new TripControlsView();
const siteMenuComponent = new MenuView();
const pointNewButtonComponent = new PointNewButtonView();

render(tripMainElement, TripControlsComponent, RenderPosition.AFTERBEGIN);
render(TripControlsComponent, siteMenuComponent, RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, pointsModel, filterModel, offersModel, destinationsModel, api);
const filterPresenter = new FilterPresenter(TripControlsComponent, filterModel, pointsModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      siteMenuComponent.setMenuItem(menuItem);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      siteMenuComponent.setMenuItem(menuItem);
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      filterPresenter.disable();
      render(pageMainBodyContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const handlePointNewButtonClick = () => {
  const isStatisticsOpened = pageMainBodyContainerElement.querySelector('.statistics');

  if (isStatisticsOpened) {
    remove(statisticsComponent);
    siteMenuComponent.setMenuItem(MenuItem.TABLE);
    tripPresenter.init();
  }

  tripPresenter.createNewPoint();
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
pointNewButtonComponent.setNewPointClickHandler(handlePointNewButtonClick);

tripPresenter.init();
filterPresenter.init();

Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getPoints(),
])
  .then( ([offers, destinations, points]) => {
    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);
    pointsModel.setPoints(UpdateType.INIT, points);
    render(tripMainElement, pointNewButtonComponent, RenderPosition.BEFOREEND);
  })
  .catch(() => {
    offersModel.setOffers([]);
    destinationsModel.setDestinations([]);
    pointsModel.setPoints(UpdateType.INIT, []);
  });

