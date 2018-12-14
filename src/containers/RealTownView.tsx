
import { compose } from "redux";
import RealTownView from "src/components/RealTownView";
import { withAppContext } from "src/hoc/withAppContext";

export default compose(
    withAppContext,
)(RealTownView);
