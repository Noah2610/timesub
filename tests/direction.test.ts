import { createTimer, Time } from "../src";

describe("timer direction", () => {
    it("plays timer with forward direction", (done) => {
        const timer = createTimer({
            duration: 50,
            updateInterval: 10,
            direction: "forward",
        });

        expect(timer.getTime()).toEqual(0);

        let prevTime: Time = timer.getTime();
        const testNewTime = jest.fn((newTime: Time) =>
            expect(newTime).toBeGreaterThan(prevTime),
        );

        timer.subscribe(({ time }) => {
            if (time === prevTime) {
                return;
            }
            testNewTime(time);
            prevTime = time;
        });

        timer.play();

        timer.on("finish", () => {
            expect(testNewTime).toHaveBeenCalled();
            done();
        });
    });

    it("plays timer with backward direction", (done) => {
        const timer = createTimer({
            duration: 50,
            updateInterval: 10,
            direction: "backward",
        });

        expect(timer.getTime()).toEqual(50);

        let prevTime: Time = timer.getTime();
        const testNewTime = jest.fn((newTime: Time) =>
            expect(newTime).toBeLessThan(prevTime),
        );

        timer.subscribe(({ time }) => {
            if (time === prevTime) {
                return;
            }
            testNewTime(time);
            prevTime = time;
        });

        timer.play();

        timer.on("finish", () => {
            expect(testNewTime).toHaveBeenCalled();
            done();
        });
    });
});
