// Header.js

import React from "react";
import { Link } from "react-router-dom";

class Header extends React.Component {
	render() {
		return (
			<header className="App-header">
				<h1 className="App-title">Lewey's App Thing</h1>
				<div className="pin-header">{this.props.pin}</div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/lessons">Lessons</Link>
						</li>
						<li>
							<Link className="nav-admin" to="/admin">Admin</Link>
						</li>
					</ul>
				</nav>
			</header>
		);
	}
}

export default Header;
