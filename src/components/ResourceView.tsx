import * as React from 'react';
import ResourceViewRow from '../containers/ResourceViewRow';


function ResourceView() {

    return (
        <div>
            <ResourceViewRow name="crossbows"/>
            <ResourceViewRow name="longbows" /> 
            <ResourceViewRow name="swords" /> 
            <ResourceViewRow name="daggers"/> 
        </div>
    );
}

export default ResourceView;

