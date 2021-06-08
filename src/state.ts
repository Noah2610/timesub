import { TimerState } from "./types";

export function createState(): TimerState {
    return {
        time: 0.0,
        isPlaying: false,
        isFinished: false,
    };
}
