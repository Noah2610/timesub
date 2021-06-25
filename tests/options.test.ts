import { createTimer, TimerListener } from "../src";

describe("timer getOption and setOption API", () => {
    it("gets and sets duration", () => {
        const timer = createTimer({
            duration: 1000,
        });
        expect(timer.getOption("duration")).toBe(1000);

        const listener: TimerListener<"setOption-duration"> = jest.fn(
            (timer, { value }) => {
                expect(value).toBe(timer.getOption("duration"));
            },
        );
        timer.on("setOption-duration", listener);

        timer.setOption("duration", 500);
        expect(timer.getOption("duration")).toBe(500);

        timer.setOption("duration", "infinite");
        expect(timer.getOption("duration")).toBe("infinite");

        expect(listener).toHaveBeenCalledTimes(2);
    });

    it("gets and sets updateInterval", () => {
        const timer = createTimer({
            updateInterval: 50,
        });
        expect(timer.getOption("updateInterval")).toBe(50);

        const listener: TimerListener<"setOption-updateInterval"> = jest.fn(
            (timer, { value }) => {
                expect(value).toBe(timer.getOption("updateInterval"));
            },
        );
        timer.on("setOption-updateInterval", listener);

        timer.setOption("updateInterval", 200);
        expect(timer.getOption("updateInterval")).toBe(200);

        expect(listener).toHaveBeenCalledTimes(1);
    });
});
