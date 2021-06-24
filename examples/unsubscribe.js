// @ts-check

const { createTimer } = require("../dist");

const timer = createTimer({
    duration: 1500,
});
timer.play();

const unsubscribe = timer.subscribe(({ time }) => {
    console.log(`Time: ${time}`);

    if (time > 1000) {
        console.log(
            "Unsubscribing!\n" +
                "Timer will still run, but subscribed function will not be called anymore.",
        );
        unsubscribe();
    }
});
