import React, {Component} from 'react';
import { ApiHelper } from '../helpers/apiHelper';
import shortId from 'shortid';

class ActionsComponent extends Component {

  constructor(props) {
    super(props);
    this.saveCohort = this.saveCohort.bind(this);
  }

  componentDidMount() {
    //make a request to get list of all saved Cohorts
    //I think we should display it separately from search history
    const apiHelper = new ApiHelper(null);
    apiHelper.get('/cohort?v=full').then(response => {
      response.json().then(data => {
        console.log(data);
        //the data shows all the cohort information, and the memberids is in each object
        // you'll have to find a way to get full user information by using their Ids
      });
    });
  }

  saveCohort(event) {
    event.preventDefault();
    const cohort = document.getElementById('cohort').value;
    const name = document.getElementById('cohort-name').value;
    const description = document.getElementById('cohort-description').value;
    if(cohort && name && description) {
      const allCohortIds = this.getMemberIds(cohort);
      const apiHelper = new ApiHelper(null);
      const postQuery = {
        display: name,
        name,
        description,
        memberIds: allCohortIds
      }
      apiHelper.post('/cohort', postQuery).then(response => {
        response.json().then(data => {
          console.log(data);
        });
      });
    } else {
      console.log('empty fields');
    }
  }

  getMemberIds(cohortSerial) {
    const { patients } = this.props.history[cohortSerial-1];
    const patientsIds = [];
    patients.forEach(eachPatient => {
      patientsIds.push(eachPatient.patientId);
    });
    return patientsIds;
  }


  render() {
    return (
      <div className="col-sm-12 section">
        <h3>Save Cohort</h3>

        <form className="form-horizontal" onSubmit={this.saveCohort}>
          <div className="form-group">
            <label className="control-label col-sm-2" >Cohorts:</label>
            <div className="col-sm-5">
              <select className="form-control" id="cohort" name="cohort">
                <option value="">--SELECT COHORT--</option>
                {this.props.history.map((eachHistory, index) => {
                  return <option key={shortId.generate()} value={index+1}>{eachHistory.description}</option>
                })}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" >Name:</label>
            <div className="col-sm-5">
              <input type="text" className="form-control" id="cohort-name" placeholder="Enter name" />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2">Description:</label>
            <div className="col-sm-5">
              <input type="text" className="form-control" id="cohort-description" placeholder="Enter description" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-success">Save</button>
              <button className="btn btn-default cancelBtn">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default ActionsComponent;
