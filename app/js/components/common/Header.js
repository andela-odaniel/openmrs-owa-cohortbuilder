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
        <li role="presentation" className="active">
        <a href="#">Logout <span className="glyphicon glyphicon-log-out"></span></a>
        </li>
      </ul>
    </header>
  );
};

export default Header;
