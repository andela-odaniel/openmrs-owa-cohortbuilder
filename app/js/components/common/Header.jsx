import React from 'react';
import { Link, IndexLink } from 'react-router';

const Header = () => {
  return (
    <nav>
      <IndexLink to="/" activeClassName="active">Home</IndexLink>
      {" | "}
      <Link to="/doesntexistyet" activeClassName="active">Path</Link>
    </nav>
  );
}

export default Header;
