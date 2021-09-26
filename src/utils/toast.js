const SHOW_TIME = 5000;

const toastContainerElement = document.createElement('div');
toastContainerElement.classList.add('toast-container');
document.body.append(toastContainerElement);

const toast = (message) => {
  const toastElement = document.createElement('div');
  toastElement.textContent = message;
  toastElement.classList.add('toast-item');

  toastContainerElement.append(toastElement);

  setTimeout(() => {
    toastElement.remove();
  }, SHOW_TIME);
};

export {toast};
