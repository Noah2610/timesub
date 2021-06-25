import { Time, TimerDirection, TimerOptions } from "../types";

export function isTimerFinished(time: Time, options: TimerOptions): boolean {
    if (options.duration === "infinite") {
        return false;
    }
    switch (options.direction) {
        case "forward": {
            return time >= options.duration;
        }
        case "backward": {
            return time <= 0;
        }
    }
}

export function updateTimeWithDirection(
    time: Time,
    diff: number,
    direction: TimerDirection,
): Time {
    switch (direction) {
        case "forward": {
            return time + diff;
        }
        case "backward": {
            return time - diff;
        }
    }
}
