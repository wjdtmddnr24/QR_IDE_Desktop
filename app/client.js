// const m_server_addr = 'http://chocola.moe:3000';
// const m_server_addr = 'http://localhost:3000';
const m_server_addr = 'http://mansuiki.com:3000';

function getCurrentWork() {
  var ret = null;
  if (m_focus_work_id)
    for (var i in m_userData.workspace) {
      if (m_userData.workspace[i]._id === m_focus_work_id) {
        return m_userData.workspace[i];
      }
    }
  return ret;
}

function getWorkById(id) {
  for (var i in m_userData.workspace) {
    if (m_userData.workspace[i]._id === id) {
      return m_userData.workspace[i];
    }
  }
  return null;
}

function sendSingleWorkById(id, title, content, callback) {
  $.ajax({
    url: `${m_server_addr}/${m_curUserName}/${id}`,
    method: 'post',
    dataType: 'json',
    data: {title: title, content: content},
    success: (data) => {
      callback(data);
    }
  });
}

function sendSingleWork(title, content, callback) {
  $.ajax({
    url: `${m_server_addr}/${m_curUserName}`,
    method: 'post',
    dataType: 'json',
    data: {title: title, content: content},
    success: (data) => {
      callback(data);
    }
  });
}

function initWorkspace() {
  if (update) clearInterval(update);
  fetch_workspace(m_curUserName, () => {
    if (m_userData && m_userData.workspace.length > 0) {
      openWork(0);
    }
    updateWorkspace();
  });
}

function addWork() {
  var date = new Date();
  sendSingleWork(`sough-${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`, '', () => {
    fetch_workspace(m_curUserName);
  });
}

function saveWork(work, callback) {
  if (!work) return;
  sendSingleWorkById(work._id, work.title, work.content, callback);
}

function deleteWork(id, callback) {
  var work = getWorkById(id);
  if (!work) return;
  $.ajax({
    url: `${m_server_addr}/${m_curUserName}/${id}`,
    method: 'delete',
    dataType: 'json',
    data: {},
    success: (data) => {
      callback(data);
    }
  });
}

function openWork(idx) {
  m_focus_work_id = m_userData.workspace[idx]._id;
  redrawWorkspace();
  redrawEditor();
}

function fetch_workspace(username, callback) {
  $.ajax({
    url: `${m_server_addr}/${username}`,
    dataType: 'json',
    data: {},
    success: (data) => {
      m_online = true;
      m_userData = data;
      redrawWorkspace();
      if (callback) callback(data);
    },
    error: () => {
      m_online = false;
    }
  });
}


function redrawWorkspace() {
  $('#cur_workspace_name').text(`${m_curUserName}의 작업공간`);
  $('#sough_workspace li').remove();
  $.each(m_userData.workspace, function (index, work) {
      $('#sough_workspace').append(
        `<li><a href="javascript:openWork(${index})" id="${work._id}" class="sough-work ${m_focus_work_id === work._id ? 'is-active' : ''}" style="word-wrap:break-word;"><span class="icon"><i class="fas fa-cloud"></i></span>&nbsp;${work.title}${m_focus_work_id === work._id && editor.getValue() !== work.content ? '*' : ''}</a></li>`
      );
    }
  );
}

function redrawEditor() {
  editor.setValue(getCurrentWork().content, -1);
}

function updateWorkspace() {
  update = setInterval(() => {
    fetch_workspace(m_curUserName);
  }, 1000);
}


