import { createTimer, Timer, TimerEvent } from ".";

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

describe("subscribe to timer", () => {
    it("subscribes and calls subscription function", () => {
        const timer = createTimer();

        const callback = jest.fn((_: Timer) => {});
        const unsubscribe = timer.subscribe(callback);

        timer.play();
        timer.pause();

        expect(callback).toHaveBeenCalledTimes(2);

        unsubscribe();
    });

    it("subscribes and unsubscribes", () => {
        const timer = createTimer();

        const callback = jest.fn((_: Timer) => {});
        const unsubscribe = timer.subscribe(callback);

        timer.play();
        expect(callback).toHaveBeenCalledTimes(1);

        unsubscribe();
        timer.pause();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("finishes timer", (done) => {
        const timer = createTimer({
            duration: 100,
            updateInterval: 50,
        });

        const expectedTimesCalled = 3;
        let timesCalled = 0;

        const callback = jest.fn(({ isPlaying }: Timer) => {
            timesCalled++;
            const expectedIsPlaying =
                timesCalled < expectedTimesCalled ? true : false;
            expect(isPlaying).toBe(expectedIsPlaying);
            if (timesCalled === expectedTimesCalled) {
                expect(callback).toHaveBeenCalledTimes(expectedTimesCalled);
                unsubscribe();
                done();
            }
        });

        const unsubscribe = timer.subscribe(callback);
        timer.play();
    });

    it("finishes timer with event", (done) => {
        const timer = createTimer({
            duration: 100,
            updateInterval: 50,
        });

        const callback = jest.fn(
            ({ isPlaying, isFinished }: Timer, event: TimerEvent) => {
                switch (event.type) {
                    case "update": {
                        expect(isPlaying).toBe(true);
                        expect(isFinished).toBe(false);
                        break;
                    }
                    case "finish": {
                        expect(isPlaying).toBe(false);
                        expect(isFinished).toBe(true);
                        expect(callback).toHaveBeenCalledTimes(3);
                        unsubscribe();
                        done();
                    }
                }
            },
        );

        const unsubscribe = timer.subscribe(callback);
        timer.play();
    });
});
