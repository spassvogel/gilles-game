import * as React from 'react';
import ResourceViewRow from './ResourceViewRow';


function ResourceView() {

    return (
        <div>
            <ResourceViewRow name="crossbow" amount={3} />
            <ResourceViewRow name="longbow" amount={4} /> 
            <ResourceViewRow name="sword" amount={5} /> 
            <ResourceViewRow name="dagger" amount={6} /> 
        </div>
    );
}

export default ResourceView;

