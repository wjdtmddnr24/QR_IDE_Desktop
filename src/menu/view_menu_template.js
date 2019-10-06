import {BrowserWindow} from "electron";
import {themes} from "../ace_themes";

var themeSubmenu = [];
themes.forEach(function (theme) {
  themeSubmenu.push({
    label: theme, click: () => {
      BrowserWindow.getFocusedWindow().webContents.executeJavaScript(`editor.setTheme("ace/theme/${theme}");`);
    }
  });
});

export const viewMenuTemplate = {
  label: "보기",
  submenu: []
};


