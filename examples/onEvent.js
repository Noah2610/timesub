// @ts-check

const { createTimer } = require("../dist");

const timer = createTimer({
    duration: 1000,
});

timer.on("play", () => {
    console.log("Started playing!");
});

timer.on("pause", () => {
    console.log("Paused.");
});

timer.on("update", ({ time }) => {
    console.log(`Time: ${time}`);
});

timer.on("finish", () => {
    console.log("Finished!");
});

timer.play();

setTimeout(() => {
    timer.pause();
    setTimeout(timer.play, 1000);
}, 500);
