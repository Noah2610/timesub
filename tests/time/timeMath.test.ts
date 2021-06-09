import { TimeObj, TimeMs } from "../../src/types";
import { timeToObj, timeMath } from "../../src/internal/util";

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
