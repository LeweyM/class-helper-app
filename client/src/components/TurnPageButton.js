// TurnPageButton.js
import React from "react";
import Icon from 'react-icons-kit';
import { circleRight } from 'react-icons-kit/icomoon/circleRight';
import { circleLeft } from 'react-icons-kit/icomoon/circleLeft';


class TurnPageButton extends React.Component {
	constructor(props) {
		super(props);
		this.handleButtonClick = this.handleButtonClick.bind(this);
	}

	handleButtonClick() {
		// console.log(this.props.dir + " button has been clicked");
		const direction = this.props.dir === "previous" ? -1 : 1;
		this.props.callback(direction);
	}

	render() {

		const direction = this.props.dir;
		let button = null;
		if (direction === "previous") {
			button = <button className='button-previous' type="button" onClick={this.handleButtonClick}> <Icon icon={circleLeft}/> </button>
		} else if (direction === "next") {
			button = <button className='button-next' type="button" onClick={this.handleButtonClick}> <Icon icon={circleRight}/> </button>
		}

		return ( 
			<div>{button}</div>
		)
	}
}

export default TurnPageButton;
