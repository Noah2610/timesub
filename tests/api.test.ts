import { createTimer } from "../src";

describe("timer API", () => {
    it("plays and pauses timer", () => {
        const timer = createTimer();
        expect(timer.isPlaying).toBe(false);

        timer.play();
        expect(timer.isPlaying).toBe(true);

        timer.pause();
        expect(timer.isPlaying).toBe(false);

        timer.togglePlay();
        expect(timer.isPlaying).toBe(true);

        timer.pause();
    });

    it("gets and sets time with API", () => {
        const timer = createTimer();
        expect(timer.getTime()).toBe(0.0);

        timer.setTime(10000);
        expect(timer.getTime()).toBe(10000);

        timer.reset();
        expect(timer.time).toBe(0.0);
    });

    it("gets and sets duration", () => {
        const timer = createTimer({
            duration: 1000,
        });
        expect(timer.getDuration()).toBe(1000);

        timer.setDuration(500);
        expect(timer.getDuration()).toBe(500);

        timer.setDuration("infinite");
        expect(timer.getDuration()).toBe("infinite");
    });

    it("gets and sets updateInterval", () => {
        const timer = createTimer({
            updateInterval: 50,
        });
        expect(timer.getUpdateInterval()).toBe(50);

        timer.setUpdateInterval(200);
        expect(timer.getUpdateInterval()).toBe(200);
    });
});
