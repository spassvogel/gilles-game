import * as moment from "moment";
import "moment-duration-format";

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

export const formatDuration = (time: number, unit: moment.DurationInputArg2 = "milliseconds" ): string => {
    return moment.duration(time, unit)
        .format("d [days] h [hours] m [min] s [sec]", {
        trim: "both",
    });
};