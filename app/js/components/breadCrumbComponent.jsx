import React from 'react';
import {Link} from 'react-router';

export default class BreadCrumbComponent extends React.Component{
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