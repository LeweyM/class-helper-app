// StudentLineItem.js

import React from "react";
import Icon from "react-icons-kit";
import { user } from 'react-icons-kit/icomoon/user';

class StudentLineItem extends React.Component {

	render() {
		return <span><Icon icon={user}/>{this.props.student}</span>
	}

}

export default StudentLineItem