import { createTimer, Timer, TimerApi } from "../src";

describe("cleanup timer", () => {
    it("cleans up timer after calling `cleanup`", () => {
        const timer = createTimer();
        timer.cleanup();
    });

    it("makes all API functions throw after calling `cleanup", () => {
        const timer = createTimer();

        const subscribeCb = jest.fn(() => {});
        timer.subscribe(subscribeCb);

        timer.play();

        timer.cleanup();

        const allApiFns = Object.keys(timer) as (keyof Timer)[];
        expect(allApiFns.length).toBeGreaterThan(0);

        let testedFns = 0;
        for (const key of Object.values(allApiFns)) {
            testedFns++;
            const val = timer[key];
            if (typeof val === "function") {
                expect(val).toThrow();
            }
        }

        expect(testedFns).toBe(allApiFns.length);
        expect(subscribeCb).toHaveBeenCalledTimes(1);
    });
});
