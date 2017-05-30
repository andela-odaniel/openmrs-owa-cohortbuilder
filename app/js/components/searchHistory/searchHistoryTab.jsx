import React, { Component, PropTypes } from 'react';
import { ApiHelper } from '../../helpers/apiHelper';
import { JSONHelper } from '../../helpers/jsonHelper'; 

import SearchHistory from './searchHistoryComponent.jsx';
import SavedHistory from './savedHistory.jsx';

class  SearchHistoryTab  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history:[],
            error: null,
            loading: false
        };
        this.updateHistory = this.updateHistory.bind(this);
        this.saveSearch = this.saveSearch.bind(this);
        this.setError = this.setError.bind(this);
    }
    componentDidMount() {
        const apiHelper = new ApiHelper();
        apiHelper.get('reportingrest/dataSetDefinition?v=full' )
            .then((res) => {
                this.setState({history: res.results});
                $('#myTab a[href="#cached"]').tab('show');
            });
    }

    parse(parameter) {
        let result = {};
        result.description = parameter.description;
        result.type = parameter.parameters.type;
        result.customRowFilterCombination = parameter.parameters.customRowFilterCombination;
        result.columns = parameter.parameters.columns;
        result.rowFilters = [];
        
        let rowFilters = parameter.parameters.rowFilters;
        rowFilters.forEach(filter => {
            const rowFilter = {};
            filter.hasOwnProperty('key') ? rowFilter.key = filter.key : false;
            filter.hasOwnProperty('type') ? rowFilter.type = "org.openmrs.module.reporting.cohort.definition.CohortDefinition" : false;
            filter.hasOwnProperty('parameterValues') ? rowFilter.parameterValues = filter.parameterValues : false;
            
            result.rowFilters.push(rowFilter);
        });
        
        return result;
    }

    updateHistory(uuid) {
        const history = this.state.history.filter((eachHistory) => eachHistory.uuid != uuid);
        this.setState({ history});
    }

    setError(error) {
        this.setState( {error, loading: false} );
    }

    saveSearch(index, name) {
        return new Promise((resolve, reject) => {
            const composer = new JSONHelper();
            const apiHelper = new ApiHelper();
            const query =  this.parse(this.props.history[index]);
            query.name = name;
            this.setState({loading: true});
            apiHelper.post('reportingrest/adhocdataset',  query )
                .then((res) => {
                    this.setState({
                        history : [...this.state.history , res]
                    });
                    this.setState({loading: false});
                    $('#myModal').modal('hide');
                    $('#myTab a[href="#saved"]').tab('show');
                    resolve(true);
                })
                .catch((error) => {
                    this.setError("An error occur, ensure you entered a valid name");
                    resolve(false);
                });
        });
      
    }
    render() {
        return (
            <div className="section">
                <div className="tab-pane active" id="cached" role="tabpanel">
                    <SearchHistory 
                        history={this.props.history} 
                        deleteHistory={this.props.deleteHistory} 
                        saveSearch={this.saveSearch}
                        error={this.state.error}
                        loading={this.state.loading}
                        />
                </div>
            </div> 
        );
    }
}

SearchHistoryTab.propTypes = {
    history: PropTypes.array.isRequired,
    deleteHistory: PropTypes.func.isRequired
};

export default SearchHistoryTab;
