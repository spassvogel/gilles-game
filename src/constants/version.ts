import { convertSemVerToInt } from 'utils/version';

// <MAJOR>.<MINOR>.<RELEASE>

const version = '0.1.0';

export default version;
export const asInt: number = convertSemVerToInt(version);
