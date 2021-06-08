import { createTimer } from "../src";

describe("createTimer", () => {
    it("creates a timer", () => {
        const timer = createTimer();
        expect(timer).toBeTruthy();
        expect(timer.time).toBe(0.0);
        expect(timer.isPlaying).toBe(false);
        expect(timer.isFinished).toBe(false);
    });

    it("creates a timer with options", () => {
        const timer = createTimer({
            duration: 1000,
            updateInterval: 50,
        });
        expect(timer).toBeTruthy();
        expect(timer.time).toBe(0.0);
        expect(timer.isPlaying).toBe(false);
        expect(timer.isFinished).toBe(false);
    });
});
