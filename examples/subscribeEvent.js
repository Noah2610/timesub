// @ts-check

const { createTimer } = require("../dist");

const timer = createTimer({
    duration: 1000,
});
timer.play();

timer.subscribe(({ time }, event) => {
    if (event.type === "finish") {
        console.log("Finished!");
    } else {
        console.log(`Time: ${time}`);
    }
});
