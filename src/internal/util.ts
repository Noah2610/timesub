import { Time, TimeMs, TimeObj } from "../types";

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

/** Adds the two given times together. */
export const addTime = (a: Time, b: Time) => timeMath(a, b, "+");
/** Subtracts time `b` from time `a`. */
export const subTime = (a: Time, b: Time) => timeMath(a, b, "-");
/** Multiplies the two given times together. */
export const mulTime = (a: Time, b: Time) => timeMath(a, b, "*");
/** Divides time `a` by time `b`. */
export const divTime = (a: Time, b: Time) => timeMath(a, b, "/");
/** Runs the modulo (`%`) operation on time `a` with time `b`. */
export const modTime = (a: Time, b: Time) => timeMath(a, b, "%");

export function timeMath(
    timeA: Time,
    timeB: Time,
    op: "+" | "-" | "*" | "/" | "%",
): Time {
    const returnAsNum = typeof timeA === "number" && typeof timeB === "number";

    const a = timeToMs(timeA);
    const b = timeToMs(timeB);

    let x: number;

    switch (op) {
        case "+": {
            x = a + b;
            break;
        }
        case "-": {
            x = a - b;
            break;
        }
        case "*": {
            x = a * b;
            break;
        }
        case "/": {
            x = a / b;
            break;
        }
        case "%": {
            x = a % b;
            break;
        }
    }

    return returnAsNum ? x : timeToObj(x);
}
