$(document).ready(function () {
  $('#sough_workspace').on('contextmenu', '.sough-work', function (e) {
    e.preventDefault();
    showWorkContextMenu(e);
  });
  $(document).click(hideWorkContextmenu);
});

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
