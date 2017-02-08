import React from 'react';

export default class TabBarComponent extends React.Component{
    render(){
        return (
            <div className="tab-bar">
                <ul className="nav nav-tabs">
                    {this.props.tabs.map(this.drawTabHeader)}
                </ul>
            </div>
        );
    }
    drawTabHeader(tab,index){
        return (
            <li key={index} className={tab.active ? 'active' : ""}><a data-toggle="tab" href={"#"+tab.divId}>{tab.name}</a></li>
        )
    }
}

TabBarComponent.propTypes = {
    tabs: React.PropTypes.array.isRequired
}