import { Time, timeToMs, timeToObj } from ".";

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
