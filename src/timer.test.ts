import { createTimer } from ".";

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

describe("timer API", () => {
    it("plays and pauses timer", () => {
        const timer = createTimer();
        expect(timer.isPlaying).toBe(false);

        timer.play();
        expect(timer.isPlaying).toBe(true);

        timer.pause();
        expect(timer.isPlaying).toBe(false);
    });

    it("gets and sets time with API", () => {
        const timer = createTimer();
        expect(timer.getTime()).toBe(0.0);

        timer.setTime(10000);
        expect(timer.getTime()).toBe(10000);
    });
});
