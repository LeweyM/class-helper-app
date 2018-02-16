// Main.js

import React  from "react";
import { Switch, Route} from "react-router-dom";
import Lobby from "./Lobby";
import Home from "./Home";
import Lessons from "./Lessons";
import Admin from "./Admin";


class Main extends React.Component {

	constructor(props) {
		super(props)
		this.sendPin = this.sendPin.bind(this)
	}

	sendPin(pin) {
		this.props.sendPinRoot(pin)
	}

	render() {
		return (
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/lobby" render={(routeProps) => {return <Lobby sendPin={(pin) => {this.sendPin(pin)}} {...routeProps} />}} />
				<Route exact path="/lessons" component={Lessons} />
				<Route exact path="/admin" component={Admin} />
			</Switch>
		);
	}
}

export default Main;
