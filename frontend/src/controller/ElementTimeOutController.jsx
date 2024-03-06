export function waitForElement(element, callBack) {
  window.setTimeout(function () {
    if (element) {
      callBack(element, element);
    } else {
      waitForElement(element, callBack);
    }
  }, 100);
}

export function timesUp(setShowModal) {
  setShowModal(true);
}
