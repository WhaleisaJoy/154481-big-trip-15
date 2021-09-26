import PointView from '../view/point';
import EditPointView from '../view/edit-point';
import { RenderPosition, render, replace, remove } from '../utils/render';
import { UserActionType, UpdateType } from '../const';
import { isEscEvent, isOnline } from '../utils/common';
import { toast } from '../utils/toast';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ABORTING: 'ABORTING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
};

export default class Point {
  constructor(pointListContainerElement, changeData, changeMode, offersModel, destinationsModel) {
    this._pointListContainerElement = pointListContainerElement;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleOpenPointEditForm = this._handleOpenPointEditForm.bind(this);
    this._handleClosePointEditForm = this._handleClosePointEditForm.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point) {
    this._point = point;
    this._offers = this._offersModel.getOffers();
    this._destinations = this._destinationsModel.getDestinations();

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new EditPointView(point, this._offers, this._destinations);

    this._pointComponent.setOpenPointEditHandler(this._handleOpenPointEditForm);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setCloseEditFormHandler(this._handleClosePointEditForm);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointListContainerElement, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetMode() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      UserActionType.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    this._pointEditComponent.reset(this._point);
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._replaceFormToPoint();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleOpenPointEditForm() {
    if (!isOnline()) {
      toast('You can\'t edit point offline');
      this._pointComponent.shake();
      return;
    }

    this._replacePointToForm();
  }

  _handleClosePointEditForm() {
    this._replaceFormToPoint();
  }

  _handleFormSubmit(update) {
    if (!isOnline()) {
      toast('You can\'t save point offline');
      this._pointEditComponent.shake();
      return;
    }

    this._changeData(
      UserActionType.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        update,
        {
          isFavorite: !update.isFavorite,
        },
      ),
    );
  }

  _handleDeleteClick(point) {
    if (!isOnline()) {
      toast('You can\'t delete point offline');
      this._pointEditComponent.shake();
      return;
    }

    this._changeData(
      UserActionType.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
