import { convertSemVerToInt } from 'utils/version'

// <MAJOR>.<MINOR>.<RELEASE>

const version = '1.3.0'

export default version
export const asInt: number = convertSemVerToInt(version)
