import { StoreState } from '../stores';
import { connect } from 'react-redux';
import TempView, { DispatchProps} from 'src/components/TempView';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { addGold } from 'src/actions/gold';
import { ResourceStoreState } from 'src/stores/resources';
import { addResources } from 'src/actions/resources';

// Temporary gui
function mapStateToProps(store:StoreState) {
    return { 
    };
}
function mapDispatchToProps(dispatch: Dispatch<AnyAction>) : DispatchProps {
    return {
        onCheatGold: (amount:number) => dispatch(addGold(amount)),
        onCheatResources: (amount:ResourceStoreState) => dispatch(addResources(amount))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TempView);