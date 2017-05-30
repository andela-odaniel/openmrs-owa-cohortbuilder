import React, {Component, PropTypes} from 'react';
import shortId from 'shortid';

import { ApiHelper } from '../../helpers/apiHelper';
import { Navigate } from './navigate';
import CohortTable from './cohortTable';
import DownloadHelper from '../../helpers/downloadHelper';
import './cohorts.css';

class ActionsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allCohort: [],
            cohortResult: [],
            toDisplay: [],
            perPage: 10,
            downloadJobIds: []
        };

        this.apiHelper = new ApiHelper();
        this.navigatePage = this.navigatePage.bind(this);
        this.getPatientsData = this.getPatientsData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChnage = this.handleChnage.bind(this);
        this.deleteCohort = this.deleteCohort.bind(this);
        this.downloadCSV = this.downloadCSV.bind(this);
    }

    componentWillMount() {
        this.getAllCohorts();
    }

    getAllCohorts() {
        const apiHelper = new ApiHelper();
        apiHelper.get('/cohort?v=full')
            .then(res => {
                this.setState(Object.assign({}, this.state, {
                    allCohort: res.results
                }));
            });
    }

    handleChnage(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const cohort = this.state.cohort;
        if (cohort && !isNaN(cohort) && this.state.hasOwnProperty('name') &&
            this.state.hasOwnProperty('description')) {
            const apiHelper = new ApiHelper();
            apiHelper.post('/cohort', this.getQueryData())
                .then((res) => {
                    this.setState(Object.assign({}, this.state, {
                            allCohort: [res, ...this.state.allCohort]
                    }));                    
                });
        } else {
            this.setState({ error: "all fields are required" });
        }
    }

	displayHistory(history, index) {
		return (
			<option value={index} key={shortId.generate()}>{history.description}</option>
		);
	}

	getQueryData() {
		return {
            display: this.state.name,
            name: this.state.name,
            description: this.state.description,
            memberIds: this.getPatientId(this.state.cohort)
		};
	}


	getPatientId(cohortId) {
		return this.props.history[cohortId].patients.map((patient) => patient.patientId);
	}

	getPagePatient(allPatients, currentPage) {
		const pagePatientInfo = [];
		for (let index = (currentPage - 1) * this.state.perPage; index < currentPage * this.state.perPage && index < allPatients.length; index++) {
			pagePatientInfo.push(
				allPatients[index]
			);
		}
		return pagePatientInfo;
	}

	navigatePage(event) {
		event.preventDefault();
		let pageToNavigate = 0;
		switch (event.target.value) {
			case 'first':
				pageToNavigate = 1;
				break;
			case 'last':
				pageToNavigate = this.state.totalPage;
				break;
			default:
				pageToNavigate = (event.target.value === 'next') ? this.state.currentPage + 1 : this.state.currentPage - 1;
		}
		const pagePatientInfo = this.getPagePatient(this.state.cohortResult, pageToNavigate);
		this.setState(Object.assign({}, this.state, {
			toDisplay: pagePatientInfo,
			currentPage: pageToNavigate
		}));
	}

	getPatientsData(cohortId, description) {
		return (e) => {
			this.apiHelper.get(`/cohort/${cohortId}/member?v=full`)
				.then(res => {
					const toDisplay = this.getPagePatient(res.results, 1);
					this.setState(Object.assign({}, this.state, {
						cohortResult: res.results,
						currentPage: 1,
						toDisplay,
						totalPage:  Math.ceil(res.results.length/this.state.perPage),
						cohortDescription: description
					}));
				}); 
		};
	}

    /**
     * Method to fetch data using the cohort uuid, format the data and download
     * it on the browser
     * @param {Number} cohortId - unique cohort id
     * @param {String} description - Description of the cohort (to be used as
     * the saved csv file name)
     * @return {undefined}
     */
    downloadCSV(cohortId, description) {
        return event => {
            event.preventDefault();
            if (this.state.downloadJobIds.includes(cohortId)) {
                return;
            }
            const downloadJobIds = [...this.state.downloadJobIds, cohortId];
            this.setState({ downloadJobIds });
            this.apiHelper.get(`/cohort/${cohortId}/member?v=full`)
				.then(response => {
                    const toSplice = this.state.downloadJobIds;
                    const spliceIndex = toSplice.indexOf(cohortId);
                    toSplice.splice(spliceIndex, 1);
                    const formattedData = this.preFromatForCSV(response.results);
                    DownloadHelper.downloadCSV(formattedData, description);
                    this.setState({ downloadJobIds: toSplice });
				}); 
        };
    }

    deleteCohort(cohortId) {
        return (e) => {
            const apiHelper = new ApiHelper();
            apiHelper.delete(`/cohort/${cohortId}`)
                .then(() => {
                    this.getAllCohorts();
                });
        };
    }

    /**
     * Method to help filter and return only required patient attributes from a
     * cohort item
     * @return { Array } - Array containing all patients in a cohort
     * item of the specified index
     */
    preFromatForCSV(results) {
        const data = [...results];
        return data.map(item => {
            const person = item.patient.person;
            return { name: person.display, age: person.age, gender: person.gender };
        });
    }

    render() {
        return(
            <div className="modal fade" id="myCohort" tabIndex="-1" role="dialog" aria-labelledby="myCohortLabel">
                <div className="row cohort-table">
                    <div className="col-sm-8 col-sm-offset-2">
                        { (this.state.toDisplay.length > 0) ?
                        <div>
                            <CohortTable toDisplay={this.state.toDisplay} description={this.state.cohortDescription} />
                            <Navigate totalPage={this.state.totalPage} currentPage={this.state.currentPage} navigatePage={this.navigatePage} />
                        </div>
                        :
                        <div className="text-center">No data to display</div>
                        }
                    </div>
                </div>
            </div>            
        );
    }
}

ActionsComponent.propTypes ={
	history: PropTypes.array.isRequired
};

export default ActionsComponent;
