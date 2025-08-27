const { exec } = require("child_process");
const fs = require("fs");

async function processCommand(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("start app")) {
    // kelajakda qo‘shimcha app’larni ishga tushirish joyi
    return "Ilova ishga tushirildi.";
  }

  if (msg.includes("open browser")) {
    if (process.platform === "win32") {
      exec("start chrome");
    } else if (process.platform === "darwin") {
      exec("open -a Safari");
    } else {
      exec("xdg-open http://google.com");
    }
    return "Brauzer ochildi.";
  }

  if (msg.includes("check disk")) {
    try {
      const stats = fs.statSync(".");
      return `📂 Joriy papka hajmi: ${stats.size} bytes`;
    } catch (err) {
      return "Diskni tekshirishda xato.";
    }
  }

  if (msg.includes("shutdown")) {
    if (process.platform === "win32") {
      exec("shutdown /s /t 10");
    } else if (process.platform === "darwin") {
      exec("osascript -e 'tell app \"System Events\" to shut down'");
    } else {
      exec("shutdown now");
    }
    return "⚠️ Kompyuter o‘chirilmoqda...";
  }

  return "🤖 Buyruq tushunilmadi, boshqa buyruq kiriting.";
}

module.exports = { processCommand };