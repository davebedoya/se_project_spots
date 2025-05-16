// Declaring a configuration object that contains the
// necessary classes and selectors.
const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn-disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

const showInputError = (formEl, inputEl, errorMsg, config) => {
  // const errorMsgID = inputEl.id + "-error";
  // const errorMsgEl = document.querySelector("#" + errorMsgID);
  // or
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  // console.log(errorMsgEl);
  // Styling if needed add here
  // inputEl.classList.add("modal__input_type_error");
  inputEl.classList.add(config.inputErrorClass);
};

const hideInputError = (formEl, inputEl, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  // inputEl.classList.remove("modal__input_type_error");
  inputEl.classList.remove(config.inputErrorClass);
};

const checkInputValidity = (formEl, inputEl, config) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  } else {
    enableButton(buttonElement, config);
  }
};

const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  // buttonElement.classList.add("modal__submit-btn-disabled");
  buttonElement.classList.add(config.inactiveButtonClass);
};

const enableButton = (buttonElement, config) => {
  buttonElement.disabled = false;
  // buttonElement.classList.remove("modal__submit-btn-disabled");
  buttonElement.classList.remove(config.inactiveButtonClass);
};

//OPTIONAL
const resetValidation = (formEl, inputList, config) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input, config);
  });
};

//TODO - use the settings object in all fucntions stead of hard coded strings

const setEventListeners = (formEl, config) => {
  // const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
  // const buttonElement = formEl.querySelector(".modal__submit-btn");
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);
  // console.log(inputList);
  // console.log(buttonElement);
  //TODO handle intial States

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", function () {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

//

const enableValidation = (config) => {
  // const formList = Array.from(document.querySelectorAll(".modal__form"));
  // console.log(config.formSelector);
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

// Passing the configuration object to enableValidation when we call it.
enableValidation(settings);
