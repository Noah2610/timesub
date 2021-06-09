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
export const timeToObj = timeToObjA;
// export const timeToObj = timeToObjB;

function timeToObjA(time: Time): TimeObj {
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

function timeToObjB(time: Time): TimeObj {
    if (typeof time === "object") {
        return time;
    }

    let ms = time;
    const h = Math.floor(ms / 1000 / 60 / 60);
    ms -= h * 60 * 60 * 1000;
    const m = Math.floor(ms / 1000 / 60);
    ms -= m * 60 * 1000;
    const s = Math.floor(ms / 1000);
    ms -= s * 1000;

    return {
        ms,
        s,
        m,
        h,
    };
}

/**
 * Adds the two given `Time`s together, and returns the new time.
 */
export function addTime(a: Time, b: Time): Time {
    return timeMath(a, b, "+");

    // if (typeof a === "number" && typeof b === "number") {
    //     return a + b;
    // }

    // const timeA = timeToObj(a);
    // const timeB = timeToObj(b);

    // const time: TimeObj = {};
    // const units: (keyof TimeObj)[] = ["ms", "s", "m", "h"];

    // for (const unit of units) {
    //     const aVal = timeA[unit];
    //     const bVal = timeB[unit];
    //     if (aVal !== undefined || bVal !== undefined) {
    //         time[unit] = (aVal ?? 0) + (bVal ?? 0);
    //     }
    // }

    // return time;
}

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