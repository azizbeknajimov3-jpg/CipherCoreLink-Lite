const { exec } = require('child_process');
const fs = require('fs');

async function processCommand(msg) {
    msg = msg.toLowerCase();

    if (msg.includes("start app")) {
        return "Ilova ishga tushirildi.";
    }

    if (msg.includes("open browser")) {
        exec("start chrome"); // Windows uchun, macOS/Linux moslashtiriladi
        return "Brauzer ochildi.";
    }

    if (msg.includes("check disk")) {
        // Lokal diskni tekshirish
        const stats = fs.statSync('.');
        return `Hozirgi papka hajmi: ${stats.size} bytes`;
    }

    if (msg.includes("shutdown")) {
        exec("shutdown /s /t 10"); // Windows misol
        return "Kompyuter o‘chirilmoqda...";
    }

    // Boshqa buyruqlar uchun default
    return "Buyruq tushunilmadi, boshqa buyruq kiriting.";
}

module.exports = { processCommand };