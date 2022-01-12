import { createTimer } from "../src";
import mockdate from "mockdate";

describe("timer timing", () => {
    afterEach(mockdate.reset);

    it("plays timer with expected timing", (done) => {
        mockdate.set(0);

        const duration = 10000;
        const updateInterval = 10;

        const timer = createTimer({
            duration,
            updateInterval,
        });

        const startTime = new Date();

        const unsubscribe = timer.on("finish", ({ time }) => {
            const endTime = new Date();
            const timeDiff = endTime.getTime() - startTime.getTime();
            expect(timeDiff).toBeGreaterThanOrEqual(duration);
            expect(timeDiff).toBeLessThan(duration + updateInterval);
            unsubscribe();
            done();
        });

        timer.play();

        mockdate.set(duration);
    });

    it("starts timer at 0 seconds with a delayed timer start", () => {
        mockdate.set(0);

        const timer = createTimer({
            updateInterval: 10,
        });

        // Call some API to trigger an internal update.
        timer.setTime(0);

        mockdate.set(1000);

        timer.play();
        expect(timer.getTime()).toBe(0);

        timer.pause();
    });
});
