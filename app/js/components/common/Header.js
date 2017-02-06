import React from 'react';

const Header = () => {
  return (
    <header>
      <div className="logo">
        <a href="../../">
          <img src="img/openmrs-with-title-small.png"/>
        </a>
      </div>
      <span className="app-title">CohortBuilder</span>
    </header>
  );
};

export default Header;
