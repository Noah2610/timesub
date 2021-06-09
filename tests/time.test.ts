import { Time, TimeObj, TimeMs } from "../src/types";
import { timeToMs, timeToObj, timeMath } from "../src/internal/util";

const expectedTime: { obj: TimeObj; ms: TimeMs } = {
    obj: {
        ms: 500,
        s: 30,
        m: 20,
        h: 2,
    },
    /*
    ms =
        500 +               // ms
        30 * 1000 +         // s
        20 * 60 * 1000 +    // m
        2 * 60 * 60 * 1000  // h
    */
    ms: 8430500,
};

describe("time number <-> object conversion", () => {
    it("converts number to object", () => {
        const time = expectedTime.ms;
        const timeObj = timeToObj(time);
        expect(timeObj).toEqual(expectedTime.obj);
    });

    it("converts object to number", () => {
        const time = expectedTime.obj;
        const timeMs = timeToMs(time);
        expect(timeMs).toEqual(expectedTime.ms);
    });

    it("converts number to number (no change)", () => {
        const time = expectedTime.ms;
        const timeMs = timeToMs(time);
        expect(timeMs).toEqual(expectedTime.ms);
    });

    it("converts object to object (no change)", () => {
        const time = expectedTime.obj;
        const timeObj = timeToObj(time);
        expect(timeObj).toEqual(expectedTime.obj);
    });
});

const exampleTimeA: { obj: TimeObj; ms: TimeMs } = {
    obj: {
        ms: 500,
        s: 30,
        m: 20,
        h: 2,
    },
    ms: 8430500,
};

const exampleTimeB: { obj: TimeObj; ms: TimeMs } = {
    obj: {
        ms: 250,
        s: 10,
        m: 5,
        h: 1,
    },
    ms: 3910250,
};

describe("timeMath function", () => {
    it("does math with time numbers", () => {
        const a = exampleTimeA.ms;
        const b = exampleTimeB.ms;

        // +
        {
            const expected = a + b;
            const result = timeMath(a, b, "+");
            expect(result).toEqual(expected);
        }

        // -
        {
            const expected = a - b;
            const result = timeMath(a, b, "-");
            expect(result).toEqual(expected);
        }

        // *
        {
            const expected = a * b;
            const result = timeMath(a, b, "*");
            expect(result).toEqual(expected);
        }

        // /
        {
            const expected = a / b;
            const result = timeMath(a, b, "/");
            expect(result).toEqual(expected);
        }

        // %
        {
            const expected = a % b;
            const result = timeMath(a, b, "%");
            expect(result).toEqual(expected);
        }
    });

    it("does math with time objects", () => {
        const a = exampleTimeA.obj;
        const b = exampleTimeB.obj;

        // +
        {
            const expected = timeToObj(exampleTimeA.ms + exampleTimeB.ms);
            const result = timeMath(a, b, "+");
            expect(result).toEqual(expected);
        }

        // -
        {
            const expected = timeToObj(exampleTimeA.ms - exampleTimeB.ms);
            const result = timeMath(a, b, "-");
            expect(result).toEqual(expected);
        }

        // *
        {
            const expected = timeToObj(exampleTimeA.ms * exampleTimeB.ms);
            const result = timeMath(a, b, "*");
            expect(result).toEqual(expected);
        }

        // /
        {
            const expected = timeToObj(exampleTimeA.ms / exampleTimeB.ms);
            const result = timeMath(a, b, "/");
            expect(result).toEqual(expected);
        }

        // %
        {
            const expected = timeToObj(exampleTimeA.ms % exampleTimeB.ms);
            const result = timeMath(a, b, "%");
            expect(result).toEqual(expected);
        }
    });
});
