import PointView from '../view/point';
import EditPointView from '../view/edit-point';
import { RenderPosition, render, replace } from '../utils/render';

export default class Point {
  constructor(pointListContainer) {
    this._pointListContainer = pointListContainer;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleOpenPointEditForm = this._handleOpenPointEditForm.bind(this);
    this._handleClosePointEditForm = this._handleClosePointEditForm.bind(this);
  }

  init(point) {
    this._point = point;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new EditPointView(point);

    this._pointComponent.setClickHandler(this._handleOpenPointEditForm);

    this._pointEditComponent.setFormSubmitHandler(this._handleClosePointEditForm);
    this._pointEditComponent.setClickHandler(this._handleClosePointEditForm);

    render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToPoint();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleOpenPointEditForm() {
    this._replacePointToForm();
  }

  _handleClosePointEditForm() {
    this._replaceFormToPoint();
  }
}
