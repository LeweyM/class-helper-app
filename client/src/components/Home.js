// Home.js

import React from "react";


class Home extends React.Component {

	constructor() {
		super();
		this.state = {
			pinFormValue: "" ,
			nameValue: "", 
			showPopup: true
		};
		this.handlePinChange = this.handlePinChange.bind(this);
		this.handlePinSubmit = this.handlePinSubmit.bind(this);
	}

	handlePinChange(e) {
		this.setState( {pinFormValue: e.target.value})
		e.preventDefault();
	}

	handlePinSubmit(e) {

		e.preventDefault();
		this.setState({showPopup: true})

		this.props.history.push({
			pathname: '/lobby',
			state: {
				lessonId: "",
				isTeacher: false,
				lessonIsNew: false,
				pinAttempt: this.state.pinFormValue,
			}
		});
	}

	render() {
		return (
			<div>
				{this.props.location.state
					? <h1>Incorrect PIN</h1>
					: null }
				<h2>Enter Pin</h2>
				<form onSubmit={this.handlePinSubmit} onChange={this.handlePinChange}>
					<input type="text" />
					<input type="submit" />
				</form>
			</div>

			)
	}
}

export default Home;