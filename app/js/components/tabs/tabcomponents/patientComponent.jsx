import React, {Component} from 'react';
import {ApiHelper} from '../../../helpers/apiHelper';

class PatientComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { patientAttributes: [], searchResults: []};
        this.searchDemographics = this.searchDemographics.bind(this);
    }

    componentDidMount(props) {
        this.props.fetchData('/personattributetype').then(data => {
            this.setState({
                patientAttributes: data.results
            });
        });
    }

    searchDemographics(event) {
        event.preventDefault();
        const fields = ['gender', 'minage', 'maxage'];
        const searchParameters = {};
        fields.forEach((fieldName) => {
            searchParameters[fieldName] = document.getElementById(fieldName).value;
        })
        this.props.search(searchParameters).then(results => {
            console.log(results);
            this.setState({searchResults: results.members});
        });
    }

    displayResults() {
        return this.state.searchResults.map((eachResult, index) => 
            <li key={index}>{`${eachResult.uuid} ${eachResult.links[0].uri}`}</li>
        );
    }

    render() {
        let attributes = this.state.patientAttributes.map((attribute) => {
            return (
                <option key={attribute.uuid} value={attribute.display}>
                    {attribute.display}
                </option>
            );
        });
    return (
        <div>
            <h3>Search By Demographic</h3>
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Gender</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="gender" name="gender">
                            <option value="all">All</option>
                            <option value="males">Male</option>
                            <option value="females">Female</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Age</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">Between:</span>
                    </div>
                    <div className="col-sm-3">
                        <input name="minage" id="minage" className="form-control" />
                    </div>
                    <span className="inline-label">And:</span>
                    <div className="col-sm-3">
                        <input name="maxage" id="maxage" className="form-control" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Birthdate</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">Between:</span>
                    </div>
                    <div className="col-sm-3">
                        <input className="form-control" type="date" name="from-date" />
                    </div>
                    <span className="inline-label">And:</span>
                    <div className="col-sm-3">
                        <input className="form-control" name="to-date" type="date" />
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <div className="checkbox patient-status">
                            <label>
                                <input type="checkbox" value="alive"/> Alive
                            </label>
                            <label>
                                <input type="checkbox" value="dead"/> Dead
                            </label>
                        </div>
                    </div>
                </div>
                
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <button type="submit" onClick={this.searchDemographics} className="btn btn-success">Search</button>
                    </div>
                </div>
            </form>
            
            <h3>Search By Person Attributes</h3>
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Which Attribute</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="gender">
                            <option value="">Any</option>
                            {attributes}
                        </select>
                    </div>
                    <label className="col-sm-1 control-label">Value</label>
                    <div className="col-sm-3">
                         <input className="form-control" type="text" name="value" />
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <button type="submit" className="btn btn-success">Search</button>
                    </div>
                </div>
            </form>

            <div className="result">
                {this.displayResults()}
            </div>
        </div>
    );
    }
}

export default PatientComponent;