import "./index.css";
import logo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import pencilIcon from "../images/pencil-icon.svg";
import plusIcon from "../images/plus.svg";
import profilePencilIcon from "../images/profile-avatar-btn.svg";

import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { data } from "autoprefixer";

import { setButtonText } from "../utils/helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "701062c8-7397-4cfb-bff9-e59e1fa313f2",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    currentUserId = userInfo._id;
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    console.log("Cards from API:", cards);
    console.log("User from API:", userInfo);

    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    avatarImage.src = userInfo.avatar;
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalBtn = document.querySelector(".profile__add-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const closeProfileModal = editModal.querySelector(".modal__close-btn");

const editModalNameInput = document.querySelector("#profile-name-input");
const editModalDescriptionInput = document.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardFormElement = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

//avatarModal
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

//Delete Form Elements
const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteFormElement = deleteModal.querySelector(".modal__form");
const deleteModalCancelBtn = deleteModal.querySelector(
  ".delete-modal-cancel-btn"
);

let currentUserId;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  // TODO - if the card is liked, set the active class on the card
  function isInitiallyLiked(data) {
    if (data.isLiked === true) {
      cardLikeBtn.classList.add("card__like-button_liked");
    } else {
      cardLikeBtn.classList.remove("card__like-button_liked");
    }
  }

  isInitiallyLiked(data);

  cardNameEl.textContent = data.name;
  cardImageEl.alt = data.name;
  cardImageEl.src = data.link;

  cardLikeBtn.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });
  cardImageEl.addEventListener("click", () => {
    handleImageClick(data);
  });
  return cardElement;
}

function handleLike(evt, id) {
  const btn = evt.currentTarget;
  const isLiked = btn.classList.contains("card__like-button_liked");
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      btn.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}
let selectedCard, selectedCardId;

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  console.log(selectedCardId);
  openModal(deleteModal);
}

function handleImageClick(data) {
  previewModalImageEl.src = data.link;
  previewModalImageEl.alt = data.name;
  previewModalCaptionEl.textContent = data.name;
  openModal(previewModal);
}

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      console.log(data);
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      avatarImage.src = data.avatar;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  api
    .createCard(inputValues)
    .then((res) => {
      const cardElement = getCardElement(res);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
      evt.target.reset();
      disableButton(cardSubmitBtn, settings);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarUserInfo(avatarLinkInput.value)
    .then((data) => {
      console.log(data.avatar);
      avatarImage.src = data.avatar;
      avatarFormElement.reset();
      disableButton(avatarSubmitBtn, settings);
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editModal,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

closeProfileModal.addEventListener("click", () => {
  closeModal(editModal);
});
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardSubmit);

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);

deleteFormElement.addEventListener("submit", handleDeleteSubmit);

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);

const logoImage = document.getElementById("logo");
const avatarImage = document.getElementById("avatar");
const pencilIconImage = document.getElementById("pencil-icon");
const plusIconImage = document.getElementById("plus-icon");
const profilePencilIconImage = document.getElementById("profile-pencil-icon");

logoImage.src = logo;
pencilIconImage.src = pencilIcon;
plusIconImage.src = plusIcon;

profilePencilIconImage.src = profilePencilIcon;
