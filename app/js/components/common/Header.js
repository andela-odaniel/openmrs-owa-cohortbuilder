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
        <li role="presentation" activeClassName="active" className="dropdown">
          <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            <span className="glyphicon glyphicon-user"></span> User <span className="caret"></span>
          </a>
          <ul className="dropdown-menu">
            <li><a href="#">My Account</a></li>
          </ul>
        </li>
        <li role="presentation" activeClassName="active" className="dropdown">
          <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            <span className="glyphicon glyphicon glyphicon-map-marker"></span> Impatient ward <span className="caret"></span>
          </a>
          <ul className="dropdown-menu">
            <li>
              <a href="#">Impatient ward</a>
            </li>
          </ul>
        </li>
        <li role="presentation" className="active">
          <a href="#">Logout <span className="glyphicon glyphicon-log-out"></span></a>
        </li>
      </ul>
    </header>
  );
};

export default Header;
