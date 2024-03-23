import { convertSemVerToInt } from 'utils/version'

// <MAJOR>.<MINOR>.<RELEASE>

const version = '1.2.2'

export default version
export const asInt: number = convertSemVerToInt(version)
