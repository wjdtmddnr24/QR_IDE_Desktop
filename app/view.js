$(document).ready(function () {
  $('#sough_workspace').on('contextmenu', '.sough-work', function (e) {
    e.preventDefault();
    showWorkContextMenu(e);
  });
  $(document).click(hideWorkContextmenu);
  $('.modal-background').click(closeModal);
  $('#qr-modal-close').click(closeModal);
  $('.sough-language-item').on('click', setMode);
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
}

var langauge_mode_map = {
  'Javascript': 'javascript',
  'Json': 'json',
  'Java': 'java',
  'C/C++': 'c_cpp',
  'Text': ''
};


function setMode(event) {
  var element = $(event.target);
  var id = langauge_mode_map[element.text().trim()];
  id = id ? id : 'text';
  $('.sough-language-item').removeClass('is-active');
  $(`#${id}`).addClass('is-active');
  $('.sough-language-item-title').text(element.text());
  editor.session.setMode(`ace/mode/${id}`);
}
