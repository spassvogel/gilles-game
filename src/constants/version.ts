import { convertSemVerToInt } from 'utils/version';

// <MAJOR>.<MINOR>.<RELEASE>

const version = '0.0.10';

export default version;
export const asInt: number = convertSemVerToInt(version);
