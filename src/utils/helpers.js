export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    //Set Loading Text
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
  }
}
