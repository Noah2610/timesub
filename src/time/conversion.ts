import { Time, TimeMs, TimeObj } from ".";

/**
 * Converts the given `Time` to milliseconds.
 */
export function timeToMs(time: Time): TimeMs {
    if (typeof time === "number") {
        return time;
    }

    let ms = time.ms ?? 0;
    if (time.s !== undefined) {
        ms += time.s * 1000;
    }
    if (time.m !== undefined) {
        ms += time.m * 60 * 1000;
    }
    if (time.h !== undefined) {
        ms += time.h * 60 * 60 * 1000;
    }

    return ms;
}

/**
 * Converts the given `Time` to the object representation of time.
 */
export function timeToObj(time: Time): TimeObj {
    if (typeof time === "object") {
        return time;
    }

    const h = Math.floor(time / 1000 / 60 / 60);
    const m = Math.floor(time / 1000 / 60) - h * 60;
    const s = Math.floor(time / 1000) - h * 60 * 60 - m * 60;
    const ms = time - h * 60 * 60 * 1000 - m * 60 * 1000 - s * 1000;

    return {
        ms,
        s,
        m,
        h,
    };
}
