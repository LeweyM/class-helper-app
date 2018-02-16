// EditLesson.js

import React from "react";

class EditLesson extends React.Component {

	render () {
		let lineIndex = -1;
		return (
			<div>
				<h1> Available Activities </h1>
				
				{this.props.lessons.map((lesson, i) => {
					return (
						<div key={lesson._id}>
							<h2>{lesson.title}</h2>
							<ul>
							{lesson.content.map(line => {
								lineIndex++
								return <li key={lesson._id + '_' + lineIndex.toString()}>{line}</li> 
							})}
							</ul>
							<button onClick={() => this.props.handleEditOnClick(i)}>Edit</button>
							<button onClick={() => this.props.handleDeleteOnClick(lesson._id)}>Delete</button>
						</div>
					)
				})}
			</div>
			)
	}

}

export default EditLesson