// NamePopup.js

import React from "react";

class NamePopup extends React.Component {

	render() {
		return (
			<div className='popup'>
				<div className='popup_inner'>
					<h2>{this.props.text}</h2>
					<form onSubmit={this.props.handleNameSubmit} onChange={this.props.handleNameChange}>
						<input type="text" />
						<input type="submit" />
					</form>
				</div>
			</div>
		)
	}

}

export default NamePopup;