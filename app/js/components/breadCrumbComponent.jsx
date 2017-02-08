import React, {Component} from 'react';
import {Link} from 'react-router';

class BreadCrumbComponent extends Component{
    render(){
        return (
            <div className="breadcrumb">
                <a href="/openmrs">
                    <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
                </a>
                <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                <span>Cohort Builder</span>
            </div>
        );
    }
}

export default BreadCrumbComponent;