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


function init() {
  m_userNames = ['wjdtmddnr24'];
  m_curUserName = m_userNames[0];
  m_users = [];
  for (var i in m_userNames) {
    fetch_workspace(m_userNames[i], true);
  }

}

function fetch_workspace(user, overwrite) {
  $.ajax({
    url: `${m_server_addr}/${user}`,
    dataType: 'json',
    data: {},
    success: (data) => {
      if (overwrite)
        m_users[user] = data;
      if (m_curUserName === data.id) {
        invalidateWorkspaceData(data.workspace, true);
        if (getUser().workspace.length > 0)
          getUser().workspace[0].focus = true;
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
      ` <li><a href="#" class="${work.focus ? 'is-active' : ''}" style="word-wrap:break-word;"><span class="icon"><i class="fas fa-cloud"></i></span>&nbsp;${work.title}</a></li>`
    );
  });
}

//TODO redraw editor

$(document).ready(function () {
  console.log("ready!");
  init();
});


/*


*/
