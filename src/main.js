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
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';
import { RenderPosition, render, remove } from './utils/render';
import { MenuItem, UpdateType, FilterType } from './const';
import { toast } from './utils/toast';
import { isOnline } from './utils/common';

const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic yo6de5myOfgh5hd3c';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v15';
const storeName = {
  POINTS: `${STORE_PREFIX}-points-${STORE_VER}`,
  OFFERS: `${STORE_PREFIX}-offers-${STORE_VER}`,
  DESTINATIONS: `${STORE_PREFIX}-destinations-${STORE_VER}`,
};

const tripMainElement = document.querySelector('.trip-main');
const pageMainBodyContainerElement = document.querySelector('.page-main .page-body__container');
const tripEventsElement = document.querySelector('.trip-events');

const api = new Api(END_POINT, AUTHORIZATION);
const pointsStore = new Store(storeName.POINTS, window.localStorage);
const offersStore = new Store(storeName.OFFERS, window.localStorage);
const destinationsStore = new Store(storeName.DESTINATIONS, window.localStorage);
const apiWithProvider = new Provider(api, pointsStore, offersStore, destinationsStore);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const TripControlsComponent = new TripControlsView();
const siteMenuComponent = new MenuView();
const pointNewButtonComponent = new PointNewButtonView();

render(tripMainElement, TripControlsComponent, RenderPosition.AFTERBEGIN);
render(TripControlsComponent, siteMenuComponent, RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, pointsModel, filterModel, offersModel, destinationsModel, apiWithProvider);
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
  if (!isOnline()) {
    toast('You can\'t create new point offline');
    return;
  }

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
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations(),
  apiWithProvider.getPoints(),
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

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});

