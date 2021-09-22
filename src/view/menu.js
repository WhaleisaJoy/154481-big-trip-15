import AbstractView from './abstract';
import { MenuItem } from '../const';

const createMenuTemplate = (activeTab) => (
  `<div class="trip-controls__navigation">
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a
      class="trip-tabs__btn ${activeTab === MenuItem.TABLE ? 'trip-tabs__btn--active' : ''}"
      data-menu-item="${MenuItem.TABLE}"
      href="#">${MenuItem.TABLE}</a>
      <a
      class="trip-tabs__btn ${activeTab === MenuItem.STATS ? 'trip-tabs__btn--active' : ''}"
      data-menu-item="${MenuItem.STATS}"
      href="#">${MenuItem.STATS}</a>
    </nav>
  </div>`
);

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._activeTab = MenuItem.TABLE;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._activeTab);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().querySelector('.trip-tabs').addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const items = this.getElement().querySelectorAll('.trip-tabs a');
    const itemActive = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);

    items.forEach((item) => item.classList.remove('trip-tabs__btn--active'));

    itemActive.classList.add('trip-tabs__btn--active');
  }
}
