import React, { Component } from 'react';
import DatePicker from "react-bootstrap-date-picker";
import shortid from 'shortid';
import moment from 'moment';
import Select from 'react-select';
import Error from '../../common/error';
import Loader from '../../common/loader';
import { JSONHelper } from '../../../helpers/jsonHelper';
import { ApiHelper} from '../../../helpers/apiHelper';

class DrugOrderComponent extends Component {
  constructor(props) {
    super();
    this.state = {
      drugs: [],
      selectedDrugsTaken: [],
      selectedDrugsStopped: [],
      generics: [],
      selectedGenerics: [],
      reasons: [],
      selectedReasons: [],
      startedDrugRegimen: 'ALL',
      loading: true,
      groupMethod: 'ANY',
      startedFromDate: '',
      startedEndDate: '',
      stoppedFromDate: '',
      stoppedEndDate: '',
      startedDays: '',
      startedMonths: '',
      stoppedDays: '',
      stoppedMonths: ''
    };
    this.jsonHelper = new JSONHelper();
    this.apiHelper = new ApiHelper();
    this.handleSelectStartRegimen = this.handleSelectStartRegimen.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectGroupMethod = this.handleSelectGroupMethod.bind(this);
    this.handleSelectDrugsTaken = this.handleSelectDrugsTaken.bind(this);
    this.handleSelectDrugsStopped = this.handleSelectDrugsStopped.bind(this);
    this.handleSelectGenerics = this.handleSelectGenerics.bind(this);
    this.handleSelectReasons = this.handleSelectReasons.bind(this);
    this.searchPatientsTakingDrugs = this.searchPatientsTakingDrugs.bind(this);
    this.resetPatientsTakingDrugs = this.resetPatientsTakingDrugs.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchData('drug')
      .then((drugs) => {
        const allDrugGenerics = {};
        const conceptsGenerics = drugs.results.map((eachDrug) => {
          return new Promise((resolve, reject) => {
            this.props.fetchData(`drug/${eachDrug.uuid}`).then((drugDetails) => {
              allDrugGenerics[drugDetails.concept.uuid] = drugDetails.concept.display;
              resolve(allDrugGenerics);
            });
          });
        });
        Promise.all(conceptsGenerics).then(drugGenerics => {
          const generics = [];
          for (let uuid in drugGenerics[0]) {
            generics.push({ uuid: uuid, name: drugGenerics[0][uuid] });
          }
          this.setState({
            drugs: drugs.results,
            generics
          });
        });
      }).catch((error) => {
        this.setState({ error: true, message: error.message });
      });
    this.props.fetchData('concept?name=REASON%20ORDER%20STOPPED')
      .then(conceptReason => {
        this.props.fetchData(`concept/${conceptReason.results[0].uuid}`)
          .then(conceptDetails => {
            this.setState({
              reasons: conceptDetails.answers
            });
          });
      });
    this.setState({ loading: false });
  }

  // showGenerics() {
  //     const genericsDisplay = [];
  //     for(let uuid in this.state.generics) {
  //         genericsDisplay.push(<option value={uuid} key={shortid.generate()}>{this.state.generics[uuid]}</option>);
  //     }
  //     return genericsDisplay;
  // }

  // showOptions(selectData) {
  //     return selectData.map((eachOption) =>
  //         <option value={eachOption.uuid} key={shortid.generate()}>{eachOption.display}</option>
  //     );
  // }

  resetPatientsTakingDrugs(event) {
    event.preventDefault();
    this.setState({
      selectedDrugsTaken: [],
      groupMethod: 'ANY',
      startedDays: '',
      startedMonths: '',
      startedFromDate: null,
      startedEndDate: null
    });
  }
  
  /**
   * Method to search for patients taking a drugs
   * @param {Object} event - Event Object
   * @return {undefined}
   */
  searchPatientsTakingDrugs(event) {
    event.preventDefault();
    const {
      groupMethod, startedDrugRegimen, startedFromDate,
      startedEndDate, selectedDrugsTaken
    } = this.state;
    const parameterValues = {
      onlyCurrentlyActive: false,
      groupMethod
    };
    if (startedDrugRegimen === 'ALL') {
      const dateFilters = this.getDateFilters();
      if (dateFilters) {
        parameterValues.activatedOnOrBefore = dateFilters.format('YYYY-MM-DD');
        parameterValues.stoppedOnOrAfter = moment().format('YYYY-MM-DD');
      } else {
        if (startedFromDate) {
          parameterValues.activatedOnOrBefore = startedFromDate;
        }
        if (startedEndDate) {
          parameterValues.stoppedOnOrAfter = startedEndDate;
        }
      }
    }

    if (selectedDrugsTaken.length > 0) {
      parameterValues.drugList = selectedDrugsTaken
        .map(drug => drug.value);
    }

    const rowFilter = 
      {
        parameterValues,
        type: 'org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition',
        key: 'reporting.library.cohortDefinition.builtIn.startedDrugOrder'
      };

    const searchOption = this.jsonHelper.composeJson();
    searchOption.query.rowFilters = [rowFilter];
    searchOption.query.customRowFilterCombination = '1';
    const searchLabel = this.getStartDrugOrderLabel();
    this.apiHelper.post('reportingrest/adhocquery?v=full', searchOption.query)
      .then(response => {
        this.props.getHistory(response, searchLabel);
        this.props.addToHistory(searchLabel, response.rows, searchOption.query);
        console.log('response - ', response.rows);
      });

  }

  /**
   * Method to generate label for started drug order searches
   * @return {String} - generated label
   */
  getStartDrugOrderLabel() {
    const {
      groupMethod, selectedDrugsTaken, startedFromDate, startedEndDate
    } = this.state;
    const drugs = selectedDrugsTaken
      .map(drug => drug.label)
      .join(', ')
      .replace(/,(?=[^,]*$)/, ' and ');

    let label = `Patients taking ${groupMethod} `;

    label += drugs.length > 0 ?
      ` of the following drugs ${drugs}` : ' of the drugs';

    if (startedFromDate && startedEndDate) {
      label += ` on or after  ${startedFromDate} & on or before ${startedEndDate}`;
    } else {
      if (startedFromDate) label += ` on or after ${startedFromDate}`;
      if (startedEndDate) label += `on or before ${startedEndDate}`;
    }
    return label;
  }

  /**
   * Helper method to get date filters when month and/or day values are selected
   * @return {Date} - Date generated from the month and day in this component
   * state
   */
  getDateFilters() {
    let date = null;
    if (this.state.startedMonths) { // this.state.startedMonths) {
      date = moment().subtract('months', this.state.startedMonths);
    }
    if (this.state.startedDays) {
      date = date ?
        date.subtract('day', this.state.startedDays) :
        moment().subtract('day', this.state.startedDays);
    }
    return date;
  }

  handleInputChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  /**
   * Method to handle selection of a group method
   * @param {Event} event event object
   * @return {undefined}
   */
  handleSelectGroupMethod(event) {
    event.preventDefault();
    this.setState({ groupMethod: event.target.value });
  }

  /**
   * Method to handle selection of drugs taken
   * @param {Array} selectedDrugs - Drugs that were selected
   * @return {undefined}
   */
  handleSelectDrugsTaken(selectedDrugsTaken) {
    this.setState({ selectedDrugsTaken });
  }

  /**
   * Method to handle selection of Drugs taken
   * @param {Array} selectedDrugs - Drugs that were selected
   * @return {undefined}
   */
  handleSelectDrugsStopped(selectedDrugsStopped) {
    this.setState({ selectedDrugsStopped });
  }

  /**
   * Method to handle selection of Generics
   * @param {Array} selectedGenerics - Selected Generics
   * @return {undefined}
   */
  handleSelectGenerics(selectedGenerics) {
    this.setState({ selectedGenerics });
  }

  /**
   * Method to handle selection of Reasons
   * @param {Array} selectedReasons - Reasons selected
   * @return {undefined}
   */
  handleSelectReasons(selectedReasons) {
    this.setState({ selectedReasons });
  }


  /**
   * Method to update the date key for different date types in the state
   * @param {String} stateKey - The key in the component state that should be
   * updated
   * @return {Function} - Call back function to be executed by the date input
   * field
   */
  handleDateChange(stateKey) {
    return value => this.setState({
      [stateKey]: this.getDateString(value)
    });
  }

  /**
   * Method to set the started drug regimen type (All or Any)
   * @param {Object} event - Event Object
   * @return {undefined}
   */
  handleSelectStartRegimen(event) {
    this.setState({ startedDrugRegimen: event.target.value });
  }

  /**
   * Method to get the date in the format MM-DD-YY from a date isoString
   * @param {String} isoString - Date in isoString format
   * @return {String} MM-DD-YY date formatted string
   */
  getDateString(isoString) {
    return isoString ? isoString.split('T')[0] : '';
  }

  render() {
    const { startedDrugRegimen } = this.state;
    if (this.state.loading) {
      return (
        <Loader />
      );
    } else if (this.state.error) {
      return (
        <Error message={this.state.message} />
      );
    } else {
      return (
        <div>
          <h3>Search By Drug Order</h3>
          <form className="form-horizontal" onSubmit={this.searchPatientsTakingDrugs}>
            <div className="form-group">
              <label htmlFor="drug" className="col-sm-2 control-label">Patients taking</label>
              <div className="col-sm-2">
                <select
                  className="form-control"
                  id="groupMethod"
                  name="groupMethod"
                  onChange={this.handleSelectGroupMethod}
                  value={this.state.groupMethod}
                >
                  <option value="ANY">Any</option>
                  <option value="ALL">All</option>
                  <option value="NONE">None</option>
                </select>
              </div>
              <span className="inline-label"><strong>of the following Drug(s):</strong></span>
              <div className="col-sm-4">
                <Select
                  multi
                  value={this.state.selectedDrugsTaken}
                  label="Select Drugs"
                  options={this.state.drugs.map(d => { return { value: d.uuid, label: d.display }; })}
                  onChange={this.handleSelectDrugsTaken}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Drug Regimen</label>
              <div className="col-sm-6">
                <label className="radio-inline">
                  <input
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="ALL"
                    onChange={this.handleSelectStartRegimen}
                    checked={startedDrugRegimen === 'ALL'}
                  />
                  All Drug Regimen
                </label>
                <label className="radio-inline">
                  <input
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio2"
                    value="ANY"
                    onChange={this.handleSelectStartRegimen}
                    checked={startedDrugRegimen === 'ANY'}
                  />
                  Current Drug Regimen
                </label>
              </div>
            </div>
            {startedDrugRegimen === 'ALL' &&
            <div>
            <div className="form-group">
              <label className="col-sm-2 control-label">When?</label>
              <div className="col-sm-2">
                <span className="inline-label">For the last:</span>
              </div>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  type="number"
                  name="month"
                  value={this.state.startedMonths}
                  id="startedMonths"
                  onChange={this.handleInputChange}
                />
              </div>
              <span className="inline-label">months and :</span>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  name="days"
                  type="number"
                  value={this.state.startedDays}
                  id="startedDays"
                  onChange={this.handleInputChange}
                />
              </div>
              <span className="inline-label">days    (optional)</span>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Date Range</label>
              <div className="col-sm-1">
                <span className="inline-label">From:</span>
              </div>
              <div className="col-sm-3">
                <DatePicker
                  dateFormat="DD-MM-YYYY"
                  className="form-control"
                  name="from-date"
                  value={this.state.startedFromDate}
                  onChange={this.handleDateChange('startedFromDate')}
                />
              </div>
              <span className="inline-label">To:</span>
              <div className="col-sm-3">
                <DatePicker
                  dateFormat="DD-MM-YYYY"
                  className="form-control"
                  name="to-date"
                  value={this.state.startedEndDate}
                  onChange={this.handleDateChange('startedEndDate')}
                />
              </div>
              <span className="inline-label">(optional)</span>
            </div>
            </div>}

            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-6">
                <button type="submit" className="btn btn-success">Search</button>
                <button onClick={this.resetPatientsTakingDrugs} type="reset" className="btn btn-default cancelBtn">Reset</button>
              </div>
            </div>
          </form>
          <br />
          <h4 className="text-center">Patients who stopped or changed a drug</h4>
          <form className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-2 control-label">When?</label>
              <div className="col-sm-2">
                <span className="inline-label">Within the last:</span>
              </div>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  type="number"
                  name="month"
                  value={this.stoppedMonths}
                  id="stoppedMonths"
                  onChange={this.handleInputChange}
                />
              </div>
              <span className="inline-label">months and :</span>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  name="days"
                  type="number"
                  value={this.stoppedDays}
                  id="stoppedDays"
                  onChange={this.handleInputChange}
                />
              </div>
              <span className="inline-label">days(optional)</span>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Date Range</label>
              <div className="col-sm-1">
                <span className="inline-label">From:</span>
              </div>
              <div className="col-sm-3">
                <DatePicker
                  dateFormat="DD-MM-YYYY"
                  className="form-control"
                  name="from-date"
                  value={this.state.stoppedFromDate}
                  onChange={this.handleDateChange('stoppedFromDate')}
                />
              </div>
              <span className="inline-label">To:</span>
              <div className="col-sm-3">
                <DatePicker
                  dateFormat="DD-MM-YYYY"
                  className="form-control"
                  name="to-date"
                  value={this.state.stoppedEndDate}
                  onChange={this.handleDateChange('stoppedEndDate')}
                />
              </div>
              <span className="inline-label">(optional)</span>
            </div>
            <br /><br />
            <div className="form-group">
              <div className="col-md-4">
                <p className="text-center">Reason(s) for change</p><Select
                  multi
                  value={this.state.selectedReasons}
                  label="Select Drugs"
                  options={this.state.reasons.map(d => { return { value: d.uuid, label: d.display }; })}
                  onChange={this.handleSelectReasons}
                />
              </div>

              <div className="col-md-4">
                <p className="text-center">Only these drugs</p>
                <Select
                  multi
                  value={this.state.selectedDrugsStopped}
                  label="Select Drugs"
                  options={this.state.drugs.map(d => { return { value: d.uuid, label: d.display }; })}
                  onChangem ru={this.handleSelectDrugsStopped}
                />
              </div>

              <div className="col-md-4">
                <p className="text-center">Only these generics</p>
                <Select
                  multi
                  value={this.state.selectedGenerics}
                  label="Select Generics"
                  options={this.state.generics.map(g => { return { value: g.uuid, label: g.name }; })}
                  onChange={this.handleSelectGenerics}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-6">
                <button type="submit" className="btn btn-success">Search</button>
                <button type="reset" className="btn btn-default cancelBtn">Reset</button>

              </div>
            </div>
          </form>
        </div>
      );
    }
  }
}

DrugOrderComponent.propTypes = {
  fetchData: React.PropTypes.func.isRequired
};

export default DrugOrderComponent;
