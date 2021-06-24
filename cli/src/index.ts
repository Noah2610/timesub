import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { TimerDuration } from "timesub";

function main() {
    const args = parseArgs();
    if (!args.duration) {
        console.error("Invalid duration");
        return;
    }
}

interface Args {
    duration: TimerDuration | undefined;
    $0: string;
}

function parseArgs(): Args {
    return yargs(hideBin(process.argv))
        .command(
            "$0 <duration>",
            "Start a timer with a given duration.",
            (yargs) =>
                yargs
                    .positional("duration", {
                        describe:
                            "duration of the timer in milliseconds, or " +
                            '"infinite" to start a timer that never finishes',
                        coerce: (arg): TimerDuration =>
                            arg === "infinite"
                                ? arg
                                : parseInt(arg) ?? undefined,
                    })
                    .demandOption("duration"),
        )
        .help().argv;
}

export default main;
