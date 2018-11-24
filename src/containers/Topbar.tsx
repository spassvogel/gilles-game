import Topbar from 'src/components/Topbar';
import { StoreState } from '../stores';
import { connect } from 'react-redux';


export function mapStateToProps(store:StoreState) {
    return { 
        gold: store.gold,
        workers: store.workers,
        workersFree: 0  // todo: memoize
    };
}


export default connect(mapStateToProps)(Topbar);