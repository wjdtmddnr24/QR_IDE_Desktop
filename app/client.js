const m_server_addr = 'http://chocola.moe:3000';

function getUser() {
  return m_users[m_curUserName];
}

function getCurrentWork() {
  for (var i in getUser().workspace) {
    if (getUser().workspace[i].focus) {
      return getUser().workspace[i];
    }
  }
  return null;
}

function getWorkById(id) {
  for (var i in getUser().workspace) {
    if (getUser().workspace[i]._id === id) {
      return getUser().workspace[i];
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

function init() {
  if (update) clearInterval(update);
  updateWorkspace();
  m_curUserName = m_userNames[0];
  for (var i in m_userNames) {
    fetch_workspace(m_userNames[i], true);
  }
}

function addWork() {
  var date = new Date();
  sendSingleWork(`sough-${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}`, '', () => {
    fetch_workspace(m_curUserName, false);
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
  for (var i in getUser().workspace) {
    if (getUser().workspace[i].focus) {
      getUser().workspace[i].focus = false;
      getUser().workspace[i].edited = false;
    }
  }
  getUser().workspace[idx].focus = true;
  redrawWorkspace();
  redrawEditor();
}

function fetch_workspace(username, overwrite) {
  $.ajax({
    url: `${m_server_addr}/${username}`,
    dataType: 'json',
    data: {},
    success: (data) => {
      if (overwrite)
        m_users[username] = data;
      if (m_curUserName === data.id) {
        invalidateWorkspaceData(data.workspace, false);
        if (overwrite && getUser().workspace.length > 0) {
          openWork(0);
        }
        redrawWorkspace();
      }
    }
  });
}

function invalidateWorkspaceData(workspace, overwrite) {
  if (overwrite) {
    getUser().workspace = [];
    for (var i in workspace) {
      getUser().workspace.push(workspace[i]);
    }
    return;
  }


  var i = 0, j = 0;
  for (; j < workspace.length; j++) {
    if (i >= getUser().workspace.length)
      break;
    if (getUser().workspace[i]._id === workspace[j]._id) {
      getUser().workspace[i].title = workspace[j].title;
      getUser().workspace[i].content = workspace[j].content;
      i++;
    } else {
      getUser().workspace.splice(i + 1, 0, workspace[j]);
    }
  }
  if (j < workspace.length) {
    while (j < workspace.length) {
      getUser().workspace.push(workspace[j]);
      j++;
    }
  }
}

function redrawWorkspace() {


  $('#cur_workspace_name').text(`${m_curUserName}의 작업공간`);
  $('#sough_workspace li').remove();
  $.each(getUser().workspace, function (index, work) {
      $('#sough_workspace').append(
        `<li><a href="javascript:openWork(${index})" id="${work._id}" class="sough-work ${work.focus ? 'is-active' : ''}" style="word-wrap:break-word;"><span class="icon"><i class="fas fa-cloud"></i></span>&nbsp;${work.title}${work.edited ? '*' : ''}</a></li>`
      );
    }
  );
}

function redrawEditor() {
  editor.setValue(getCurrentWork().content, -1);
}

function updateWorkspace() {
  update = setInterval(() => {
    fetch_workspace(m_curUserName, false);
  }, 1000);
}


