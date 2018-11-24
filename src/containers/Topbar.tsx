import Topbar from 'src/components/Topbar';
import { StoreState } from '../stores';
import { connect } from 'react-redux';
import { selectFreeWorkers } from 'src/selectors/workers';


function mapStateToProps(store:StoreState) {
    return { 
        gold: store.gold,
        workers: store.workers,
        workersFree: selectFreeWorkers(store)
    };
}


export default connect(mapStateToProps)(Topbar);