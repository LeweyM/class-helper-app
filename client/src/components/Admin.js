// Admin.js

import React from "react";
import CreateLesson from "./CreateLesson"
import EditLesson from "./EditLesson"

class Admin extends React.Component {

	constructor() {
		super()
		this.state = {
			panel: "create",
			lessons: [],
			editId: null,
			loading: true,
		}
		this.handleEditOnClick = this.handleEditOnClick.bind(this)
		this.handleDeleteOnClick = this.handleDeleteOnClick.bind(this)
		this.updateLessonData = this.updateLessonData.bind(this)
	}

	handleEditOnClick(index) {
		this.setState({
			panel: "update",
			editId: index
			})
	}

	handleDeleteOnClick(lessonId) {
		const id = lessonId

		 fetch(`http://localhost:5000/api/activity/${id}`, { method : 'Delete' })
			 .then(response => {
			 	if (!response.ok) alert('failed to delete');
			 	else console.log('all ok')
			 }).then(() => {
			 	this.updateLessonData()
			 })
	}

	handleOnClick(buttonValue) {
		this.setState({ panel: buttonValue })
	}

	componentWillMount() {
		this.updateLessonData();
	}

	updateLessonData() {
		fetch("/api/allLessons")
			.then(result => {
				return result.json();
			})
			.then(data => {
				this.setState({ 
					lessons: data.lessons,
					panel: "edit", 
					loading: false
				});
			})
	}

	render() {
		let panel
		switch(this.state.panel) {
			case "create":
				panel = <CreateLesson 
					newLesson={true}
					updateLessonData={() => this.updateLessonData()} 
				/>;
				break
			case "update":
				panel = <CreateLesson 
					newLesson={false}
					lesson={this.state.lessons[this.state.editId]} 
					updateLessonData={() => this.updateLessonData()} 
					/>;
				break				
			case "edit":
				this.state.loading 
					? panel = <p> Loading Activities... </p>
					: panel = <EditLesson 
						lessons={this.state.lessons} 
						handleEditOnClick={this.handleEditOnClick} 
						handleDeleteOnClick={this.handleDeleteOnClick}
						/>
				break
			default:
				panel = <CreateLesson />;
				break
		}

		return (
			<div>
				<button onClick={() => this.handleOnClick("create")}>Create</button>
				<button onClick={() => this.handleOnClick("edit")}>Edit</button>
				{panel}
			</div>
			)
	}

}

export default Admin;
