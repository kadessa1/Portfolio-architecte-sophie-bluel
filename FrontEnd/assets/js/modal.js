function showModal(selector) {
  var modal = document.getElementById(selector);
  modal.style.display = "block";
}

function closeModal() {
  var closeHandlers = document.querySelectorAll('.modal');
  closeHandlers.forEach(closeHandler => {
    closeHandler.style.display = "none";
  });
}
