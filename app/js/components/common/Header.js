import React from 'react';
import { Link, IndexLink } from 'react-router';

const Header = () => {
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
              <span className="glyphicon glyphicon-user"></span> User <span className="caret"></span>
            </a>
            <ul className="dropdown-menu user">
              <li><a href="#">My Account</a></li>
            </ul>
          </li>
        </Link>

        <Link to="" activeClassName="active">
          <li className="dropdown dropdown-large">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
              <span className="glyphicon glyphicon glyphicon-map-marker"></span> Inpatient ward <span className="caret"></span>
            </a>
            <ul className="dropdown-menu dropdown-menu-large row">
              <li className="col-sm-3">
                  <a href="#">Inpatient ward</a>
                  <a href="#">Isolation ward</a>
              </li>

              <li className="col-sm-3">
                <a href="#">Laboratory</a>
                <a href="#">Outpatient Clinic</a>
              </li>

              <li className="col-sm-3">
                <a href="#">Pharmacy</a>
                <a href="#">Registration desk</a>
              </li>
            </ul>
          </li>
        </Link>

        <Link to="" activeClassName="active">
          <li>
            <a href="#">Logout <span className="glyphicon glyphicon-log-out"></span></a>
          </li>
        </Link>
      </ul>
    </header>
  );
};

export default Header;
