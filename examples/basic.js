// @ts-check

const { createTimer } = require("../dist");

const timer = createTimer();

timer.play();

let interval = setInterval(() => {
    console.log(`isPlaying? ${timer.isPlaying}, time: ${timer.time}`);
}, 100);

setTimeout(() => {
    timer.pause();
    console.log(`isPlaying? ${timer.isPlaying}`);
    clearInterval(interval);
}, 1000);
