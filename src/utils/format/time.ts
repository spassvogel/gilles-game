import { TextManager } from 'global/TextManager';

export const ONE_SECOND = 1000;
export const TWO_SECONDS = 2000;
export const THREE_SECONDS = 3000;
export const FOUR_SECONDS = 4000;
// ...
export const TEN_SECONDS = 10000;
export const TWENTY_SECONDS = 20000;
export const THIRTY_SECONDS = 30000;

export const ONE_MINUTE = 60000;
export const TWO_MINUTES = 120000;
export const THREE_MINUTES = 180000;
export const FOUR_MINUTES = 240000;

export const HALF_HOUR = ONE_MINUTE * 30;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_YEAR = ONE_DAY * 265.25;

export const formatDuration = (ms: number, short?: boolean): string => {
    const timeUnitsList = [
        { unit: short? 'y' : 'year', amount: ONE_YEAR },
        { unit: short? 'd' : 'day', amount: ONE_DAY },
        { unit: short? 'h' : 'hour', amount: ONE_HOUR },
        { unit: short? 'm' : 'minute', amount: ONE_MINUTE },
        { unit: short? 's': 'second', amount: ONE_SECOND },
    ]
    let time = Math.abs(ms);
    const output: string[] = [];
    timeUnitsList.forEach((el) => {
        const tmp = Math.floor(time / el.amount);
        time -= tmp * el.amount
        if (tmp !== 0) {
            const unit = TextManager.get(`common-time-${el.unit}${tmp > 1 && !short ? "-plural": ""}`);
            output.push(`${tmp}${unit}`);
        }
    })
    return output.join(" ");
}
