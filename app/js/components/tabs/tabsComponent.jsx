import React from 'react';

import Components from './tabcomponents';
import TabBarComponent from './tabBarComponent';
import TabContentComponent from './tabContentComponent';

import './tabs.css';

const TabsComponent =  React.createClass({
    getInitialState(){
        return {
            tabs: [
                {active: true, name: 'Concept / Observation', divId: 'concept', component: Components.ConceptComponent },
                {active: false, name: 'Patient Attributes', divId: 'patient', component: Components.PatientComponent },
                {active: false, name: 'Encounter', divId: 'encounter', component: Components.EncounterComponent},
                {active: false, name: 'Programmme Enrollment', divId: 'programme', component: Components.ProgrammeComponent},
                {active: false, name: 'Drug Order', divId: 'drug', component: Components.DrugOrderComponent },
                {active: false, name: 'SQL', divId: 'sql', component: Components.SqlComponent },
                {active: false, name: 'Composition', divId: 'composition', component:  Components.CompositionComponent }
            ]
        }
    },

    render(){
        return (
            <div className="tabs-div">
                <TabBarComponent tabs={this.state.tabs}/>
                <TabContentComponent tabs={this.state.tabs}/>
            </div>
        )
    }

});

export default TabsComponent;