// @ts-check

const { createTimer } = require("../dist");

const timer = createTimer();
timer.play();

let timesReset = 0;

timer.subscribe(({ time, play, pause, reset }) => {
    if (timesReset > 3) {
        pause();
        return;
    }

    console.log(`Time: ${time}`);

    if (time > 1000) {
        timesReset++;
        console.log(`RESET ${timesReset}`);
        reset();
        play();
    }
});
