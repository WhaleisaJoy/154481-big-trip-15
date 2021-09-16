import EditPointView from '../view/edit-point';
import { RenderPosition, render, remove } from '../utils/render';
import { UserActionType, UpdateType } from '../const';
import { nanoid } from 'nanoid';

export default class PointNew {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._pointEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponent = new EditPointView();

    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserActionType.ADD_POINT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()}, point),
    );

    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }
}
