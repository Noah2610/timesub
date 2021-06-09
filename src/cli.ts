#!/usr/bin/env node

import { createTimer } from ".";

const duration = process.argv[2];

if (!duration) {
    printUsage();
    process.exit(1);
}

cli(duration);

function printUsage() {
    console.log("Usage:\n" + "    timesub DURATION_MS");
}

function cli(durationS: string) {
    const duration = parseInt(durationS);

    if (Number.isNaN(duration)) {
        console.log(`Invalid DURATION_MS given: ${durationS}`);
        printUsage();
        process.exit(1);
    }

    const timer = createTimer({
        duration,
        updateInterval: 50,
    });

    timer.subscribe(({ time }) => {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(formatTime(time));
    });

    timer.on("finish", () => {
        process.stdout.write("\n");
        process.exit(0);
    });

    timer.play();
}

function formatTime(ms: number): string {
    const mins = Math.floor(ms / 1000 / 60);
    ms -= mins * 60 * 1000;
    const secs = Math.floor(ms / 1000);
    ms -= secs * 1000;
    const pad = (n: number, l = 2) => n.toString().padStart(l, "0");
    return `${pad(mins)}:${pad(secs)}.${pad(ms, 3)}`;
}
