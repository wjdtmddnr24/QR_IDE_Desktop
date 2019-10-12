$(document).ready(function () {
  $('#sough_workspace').on('contextmenu', '.sough-work', function (e) {
    e.preventDefault();
    showWorkContextMenu(e);
  });
  $(document).click(hideWorkContextmenu);
  $('.modal-background').click(closeModal);
  $('#qr-modal-close').click(closeModal);
});

function closeModal() {
  $('#qr-modal').removeClass('is-active');
}

function hideWorkContextmenu() {
  $('#work-contextmenu').css({
    'display': 'none',
  });
}

function showWorkContextMenu(e) {
  $('#work-contextmenu').css({
    'display': 'block',
    'left': `${e.pageX}px`,
    'top': `${e.pageY}px`
  });
}

function shareQR() {
  makeQR(() => {
    $('#qr-modal').addClass('is-active');
  });


  // TODO modal 추가
}
