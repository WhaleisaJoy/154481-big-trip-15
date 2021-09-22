import EditPointView from '../view/edit-point';
import { RenderPosition, render, remove } from '../utils/render';
import { UserActionType, UpdateType, TYPES } from '../const';
import dayjs from 'dayjs';

const EMPTY_POINT = {
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  type: TYPES[0],
  destination: {
    name: '',
    description: null,
    pics: null,
  },
  basePrice: '',
  offers: [],
  isFavorite: false,
};

export default class PointNew {
  constructor(pointListContainer, changeData, offersModel, destinationsModel) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._pointNewButtonComponent = document.querySelector('.trip-main__event-add-btn');

    this._pointEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._offers = this._offersModel.getOffers();
    this._destinations = this._destinationsModel.getDestinations();

    this._pointNewButtonComponent.disabled = true;
    this._pointEditComponent = new EditPointView(EMPTY_POINT, this._offers, this._destinations);

    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    this._pointNewButtonComponent.disabled = false;

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointEditComponent.shake(resetFormState);
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
      point,
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }
}
