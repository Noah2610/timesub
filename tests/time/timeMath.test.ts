import { TimeMs, TimeObj, timeMath, timeToObj } from "../../src/time";

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

describe("timeMath with numbers", () => {
    const a = exampleTimeA.ms;
    const b = exampleTimeB.ms;

    it("adds numbers", () => {
        const expected = a + b;
        const result = timeMath(a, b, "+");
        expect(result).toEqual(expected);
    });

    it("subtracts numbers", () => {
        const expected = a - b;
        const result = timeMath(a, b, "-");
        expect(result).toEqual(expected);
    });

    it("multiplies numbers", () => {
        const expected = a * b;
        const result = timeMath(a, b, "*");
        expect(result).toEqual(expected);
    });

    it("divides numbers", () => {
        const expected = a / b;
        const result = timeMath(a, b, "/");
        expect(result).toEqual(expected);
    });

    it("modulos numbers", () => {
        const expected = a % b;
        const result = timeMath(a, b, "%");
        expect(result).toEqual(expected);
    });
});

describe("timeMath with objects", () => {
    const a = exampleTimeA.obj;
    const b = exampleTimeB.obj;

    it("adds objects", () => {
        const expected = timeToObj(exampleTimeA.ms + exampleTimeB.ms);
        const result = timeMath(a, b, "+");
        expect(result).toEqual(expected);
    });

    it("subtracts objects", () => {
        const expected = timeToObj(exampleTimeA.ms - exampleTimeB.ms);
        const result = timeMath(a, b, "-");
        expect(result).toEqual(expected);
    });

    it("multiplies objects", () => {
        const expected = timeToObj(exampleTimeA.ms * exampleTimeB.ms);
        const result = timeMath(a, b, "*");
        expect(result).toEqual(expected);
    });

    it("divides objects", () => {
        const expected = timeToObj(exampleTimeA.ms / exampleTimeB.ms);
        const result = timeMath(a, b, "/");
        expect(result).toEqual(expected);
    });

    it("modulos objects", () => {
        const expected = timeToObj(exampleTimeA.ms % exampleTimeB.ms);
        const result = timeMath(a, b, "%");
        expect(result).toEqual(expected);
    });
});
