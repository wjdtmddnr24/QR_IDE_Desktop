$(document).ready(function () {
  $('#sough_workspace').on('contextmenu', '.sough-work', function (e) {
    e.preventDefault();
    showWorkContextMenu(e);
  });

  $(document).click(hideContextmenu);
  $('.modal-background').click(closeModal);
  $('.modal-close').click(closeModal);
  $('.close-modal').click(closeModal);
  $('.sough-language-item').on('click', setMode);


  $('#workspace-save').on('click', () => {
    m_userNames[0] = $('#workspace-input').val();
    init();
    closeModal();
  });
  $(`#text`).addClass('is-active');

  editor.on('change', () => {
    if (!getCurrentWork()) return;
    getCurrentWork().edited = (getCurrentWork().content !== editor.getValue());
    redrawWorkspace();
  });
});

function closeModal() {
  $('.modal').removeClass('is-active');
}

function hideContextmenu() {
  $('.context-menu').css({
    'display': 'none',
  });
}

function showWorkContextMenu(e) {
  var id = $(e.target).attr('id');
  $('#work-contextmenu').css({
    'display': 'block',
    'left': `${e.pageX}px`,
    'top': `${e.pageY}px`
  });
  $('#work-contextmenu-rename').unbind('click').on('click', () => {
    renameWork(id);
  });

  $('#work-contextmenu-delete').unbind('click').on('click', () => {
    deleteWork(id, () => {
      fetch_workspace(m_curUserName, true);
    });
  });


}

function renameWork(id) {
  var work = getWorkById(id);
  if (!work) return;
  $('#work-rename-modal').addClass('is-active');
  $('#rename-input').val(work.title);


  $('#rename-ok').unbind('click').on('click', () => {
    var name = $('#rename-input').val();
    getWorkById(id).title = name;
    sendSingleWorkById(id, name, work.content, () => {
      closeModal();
      //TODO refetch workspace
      fetch_workspace(m_curUserName, false);
    });
  });
}

function shareQR() {
  makeQR(() => {
    $('#qr-modal').addClass('is-active');
  });
}


function setupWorkspace() {
  $('#workspace-modal').addClass('is-active');
  $('#workspace-input').val(m_curUserName);
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
