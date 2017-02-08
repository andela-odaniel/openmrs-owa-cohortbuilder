import React from 'react';
import BreadCrumbComponent from './breadCrumbComponent';
import TabsComponent from './tabs/tabsComponent';

export default class PageComponent extends React.Component{
    render(){
        return(
            <div className="body-wrapper">
                <TabsComponent />
            </div>
        );
    }
};