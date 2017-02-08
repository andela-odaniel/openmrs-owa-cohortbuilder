import React from 'react';

export default class TabContentComponent extends React.Component{
    render(){
        return (
            <div className="tab-content">
                {this.props.tabs.map(this.drawComponent)}
            </div>
        );
    }
    drawComponent(tab,index){
        return(
            <div id={tab.divId} key={index} className={'tab-pane fade in ' + (tab.active ? 'active' : '')}>
                <tab.component/>
            </div>
        );
    }
};

TabContentComponent.propTypes = {
    tabs: React.PropTypes.array.isRequired
}
