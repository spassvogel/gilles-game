import { convertSemVerToInt } from "src/utils/version";

// <MAJOR>.<MINOR>.<RELEASE>

const version = "0.0.4";

export default version;
export const asInt: number = convertSemVerToInt(version);
