// This example requires an actual react setup.

// const { useEffect, useState } = require("react");
const { createTimer } = require("../dist");

function MyTimer() {
    const [timer, setTimer] = useState(createTimer);

    useEffect(() => {
        const unsubscribe = timer.subscribe((newTimer) =>
            // We destructure the timer object here, because otherwise
            // the timer would stay the same object reference, and would
            // therefor not trigger a react re-render.
            setTimer({ ...newTimer }),
        );
        return unsubscribe;
    }, []);

    return (
        <div>
            <p>Is playing: {timer.isPlaying}</p>
            <p>Time: {timer.time}</p>
        </div>
    );
}
