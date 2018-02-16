// Lessons.js

import React from "react";

class Lessons extends React.Component {

	constructor() {
		super();
		this.state = {
			lessons:[],
			loading: true,
		};
	}

	componentDidMount() {
		fetch("/api/allLessons")
			.then(result => {
				return result.json();
			})
			.then(data => {
				this.setState({ 
					lessons: data.lessons,
					loading: false, 
				});
			});
	}

	handleButtonClick = (lessonId) => {
		this.props.history.push({
			pathname: '/lobby',
			state: {
				lessonId: lessonId,
				teacherName: "Lewey",
				isTeacher: true,
				lessonIsNew: true,
			}
		});
	}

	render() {
		let rend

		if (this.state.loading) {rend = <p> loading... </p>}
			else { rend = (
				<div>
					<h2>lessons</h2>
					<div>
						{this.state.lessons.map((lesson, index) => {
							return (
								<div key={index}>
									<h1>{lesson.title}</h1>
									<h2>{lesson.content[0]}</h2>
									<button type="button" onClick={() => this.handleButtonClick(lesson._id)}>Start Lesson</button>
								</div>
							);
						})}
					</div>
				</div>
				)
			}

		return rend;
	}
}

export default Lessons;
