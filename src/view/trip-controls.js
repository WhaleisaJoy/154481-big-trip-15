import AbstractView from './abstract';

const createTripControlsTemplate = () => '<div class="trip-main__trip-controls  trip-controls"></div>';

export default class TripControls extends AbstractView {
  getTemplate() {
    return createTripControlsTemplate();
  }
}
