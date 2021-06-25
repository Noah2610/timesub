import { Time, TimerOptions, TimerState } from "./types";

export function createState(options: TimerOptions): TimerState {
    return {
        time: getInitialTime(options),
        isPlaying: false,
        isFinished: false,
    };
}

function getInitialTime(options: TimerOptions): Time {
    if (options.direction === "forward") {
        return 0.0;
    }
    if (options.duration === "infinite") {
        return 0.0;
    }
    // direction === "backward" && duration === "infinite"
    // Start at time `0` and count backwards into negative infinity.
    return options.duration;
}
