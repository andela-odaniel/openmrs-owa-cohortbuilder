import React from 'react';
import { Link, IndexLink } from 'react-router';

const Header = () => {
  // Dropdown data to be displayed
  const dropdownData = [
    'Inpatient ward',
    'Isolation ward',
    'Laboratory',
    'Outpatient Clinic',
    'Pharmacy',
    'Registration desk'
  ];

  // Renders the menu data in columns of three and rows determined by dropdownData.length
  const dropFunc = () => {
    const menuDisplay = [];
    const numPerColumn = Math.ceil(dropdownData.length / 3);
    const numOfColumns = 3;
    for(let cols = 0; cols < numOfColumns; cols++) {
      const menuInColumns = [];
      let colStart = cols * numPerColumn;
      let colEnd = (cols+1) * numPerColumn;
      for(let menuIndex = colStart; menuIndex < colEnd; menuIndex++) {
        menuInColumns.push(<a href="#" key={menuIndex}>{dropdownData[menuIndex]}</a>);
      }
      menuDisplay.push(<li className="col-sm-4" key={cols}>{menuInColumns}</li>);
    }

    return menuDisplay;
  };

  return (
    <header>
      <div className="logo">
        <a href="../../">
          <img src="img/openmrs-with-title-small.png"/>
        </a>
      </div>

      <ul className="navbar-right nav-header">
        <Link to="" activeClassName="active">
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
              <span className="glyphicon glyphicon-user" /> User <span className="caret" />
            </a>
            <ul className="dropdown-menu user">
              <li><a href="#">My Account</a></li>
            </ul>
          </li>
        </Link>

        <Link to="" activeClassName="active">
          <li className="dropdown dropdown-large">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
              <span className="glyphicon glyphicon glyphicon-map-marker" /> Inpatient ward <span className="caret" />
            </a>
            <ul className="dropdown-menu dropdown-menu-large row">
              {/*Execute the function*/}
              {dropFunc()}
            </ul>
          </li>
        </Link>

        <Link to="" activeClassName="active">
          <li>
            <a href="#">Logout <span className="glyphicon glyphicon-log-out" /></a>
          </li>
        </Link>
      </ul>
    </header>
  );
};



export default Header;
