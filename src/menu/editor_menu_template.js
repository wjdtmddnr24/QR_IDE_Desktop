import {BrowserWindow} from "electron";
import {themes} from "../ace_themes";

var themeSubmenu = [];
themes.forEach(function (theme) {
  themeSubmenu.push({
    label: theme, click: () => {
      //TODO 화이트/다크테마로만 구분하기
      BrowserWindow.getFocusedWindow().webContents.executeJavaScript(`editor.setTheme("ace/theme/${theme}");`);
    }
  });
});

export const editorMenuTemplate = {
  label: "에디터",
  submenu: [
    {
      label: "줄번호 보기", click: () => {
        //TODO 줄번호 토글
      }
    },
    {label: "테마", submenu: themeSubmenu}

  ]
};


