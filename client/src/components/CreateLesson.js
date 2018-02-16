// CreateLesson.js

import React from "react";
import axios from 'axios'

const myAxios = axios.create({
  baseURL: 'http://localhost:5000/api',
});

class CreateLesson extends React.Component {

	constructor(props) {
		super(props)
		this.addInput = this.addInput.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.state = {
			title: "",
			content: [""],
		}
	}

	addInput(e) {
		e.preventDefault()
		this.setState({
			content: this.state.content.concat("")
		})
	}

	handleTitleChange(e) {
		e.preventDefault()
		this.setState({ title: e.target.value })
	}

	handleContentChange(inputId, e) {
		e.preventDefault()
		let contentArr = [...this.state.content]
		contentArr[inputId] = e.target.value
		this.setState({ content: contentArr })
	}

	handleRemove(inputId, e) {
		e.preventDefault()
		let contentArr = [...this.state.content]
		contentArr.splice(inputId, 1)
		this.setState({ content: contentArr})
		}

	handleAdd(inputId, e) {
		e.preventDefault()
		let contentArr = [...this.state.content]
		contentArr.splice(inputId + 1, 0, "")
		this.setState({ content: contentArr})
		}

	handleSubmit() {
		if (!this.props.newLesson) {
			//PUT request to update
			let data = {
				title: this.state.title,
				content: this.state.content,
				_id: this.props.lesson._id
			}
			myAxios.put('/activity', data)
				.then(function (response) {
				})
				.catch(function (err) {
					console.log(err)
				}).then(() => {
					this.props.updateLessonData()
				})
		} else {
			//POST request to create
			let data = {
				title: this.state.title,
				content: this.state.content
			}
			myAxios.post('/activities', data)
			  .then(function (response) {
			  })
			  .catch(function (error) {
			    console.log(error);
			  }).then(() => {
					this.props.updateLessonData()
				})
			}
		}

	componentWillMount() {
		if (this.props.lesson && !this.props.newLesson) {
			this.setState({
				title: this.props.lesson.title,
				content: this.props.lesson.content
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.newLesson === true) {
			this.setState({ 
					title: "",
					content: [""]
			})			
		}
	}

	render() {
		let inputId = -1
		return (
			<div>
				{this.props.newLesson ? <h1> Create New Lesson </h1> : <h1> Edit Lesson </h1>}
				<form>
					<input value={this.state.title} onChange={this.handleTitleChange.bind(this)}></input>
					{this.state.content.map((input) => {
						return (
							<div key={inputId++}>
								<input value={input} onChange={this.handleContentChange.bind(this, inputId)}></input>
								<button onClick={this.handleAdd.bind(this, inputId)}>Add</button>
								<button onClick={this.handleRemove.bind(this, inputId)}>Remove</button>
							</div>
							)

					})}					
				</form>
				<button onClick={this.addInput}>add</button>
				<button onClick={this.handleSubmit}>Submit</button>
			</div>
			)
	}

}


export default CreateLesson;
