// StudentPanel.js

import React from "react";
import StudentLineItem from "./StudentLineItem"
import Icon from "react-icons-kit";
import { userTie } from 'react-icons-kit/icomoon/userTie';

class StudentPanel extends React.Component {

	render() {
		
		return ( 
			<div className='student-wrapper'> 
				<h1> Hi {this.props.clientName}!</h1>
				{this.props.studentData.teacherName === this.props.clientName 
					? <h2> You are the teacher! </h2>
					: <h2> <Icon icon={userTie}/>{this.props.studentData.teacherName}</h2>}
				{this.props.studentData.studentNames
					.filter(student => student !== this.props.clientName)
					.map((student, index) => 
						<StudentLineItem student={student} key={index}/>) 
				}
				
			</div>
		)
	}
}

export default StudentPanel;
