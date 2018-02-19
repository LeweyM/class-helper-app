// Lobby.js
import React from "react";
import InterfacePanel from "./InterfacePanel";
import StudentPanel from "./StudentPanel";
import NamePopup from "./NamePopup";
import io from "socket.io-client";

const socket = io();

class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clientName: "",
			showNamePopup: true,
			nameInputValue: "",
			isTeacher: false,
			teacherName: "",
			studentData: {
				teacherId: null,
				teacherName: "",
				studentIds: [],
				studentNames: [],
			},
			lessonId: null,
			lessonData: {
				_id: null,
				title: "",
				content: [],
				created: ""
			},			
			roomId: null,
			pin: "",
			leadPage: 4,
			clientPage: 0,
		};
		this.pageTurn = this.pageTurn.bind(this)
	}

	pageTurn(pageDirection) {
        // callback for when the button child component is used
        if (
        	(pageDirection > 0 && this.state.clientPage < this.state.leadPage) ||
        	(pageDirection < 0 && this.state.clientPage > 0) ) {
		        this.setState({clientPage: this.state.clientPage + pageDirection})
			}
        if (this.state.isTeacher) {
        	if (
        		(pageDirection > 0 
        		&& this.state.clientPage < (this.state.lessonData.content.length - 1)) 
	        		||
        		(pageDirection < 0 
    			&& this.state.clientPage > 0) ) {
		        	this.setState({clientPage: this.state.clientPage + pageDirection})
		        	socket.emit(
		        		'leadPageUpdate', 
		        		this.state.clientPage + pageDirection, 
		        		this.state.roomId
		        		)
	        }
        }       	
    }

    loadLesson() {
    	if (this.state.lessonId) {
			fetch("/api/lesson/" + this.state.lessonId)
				.then(result => {
					return result.json();
				})
				.catch(() => {
					console.log('error')
				})
				.then(data => {
					this.setState({ lessonData: data });
				});			
	    }
	}

	togglePopup(e) {
		this.setState({showNamePopup: !this.state.showNamePopup})
	}

	handleNameSubmit(e) {
		e.preventDefault();
		this.setState({clientName: this.state.nameInputValue})
		socket.emit('nameUpdate', 
			this.state.nameInputValue, 
			this.state.isTeacher,
			this.state.roomId
			)
		this.togglePopup();
		
	}

	handleNameChange(e) {
		e.preventDefault()
		this.setState( {nameInputValue: e.target.value} )
	}

	componentDidMount() {
		this.loadLesson();
	}

	componentWillMount() {

		//if user is coming from Lessons button...

		this.listen()

		const newState = this.props.location.state;

		if (newState && newState.lessonIsNew) {

			//create a new lesson room on backend, apply appropriate properties.
			this.setState({lessonId: newState.lessonId})
			socket.emit('createNewLesson', newState.lessonId)

			//if client is the teacher, update the state accordingly
			if (newState.isTeacher) {
				this.setState({isTeacher: true, roomId: socket.id});
				socket.emit('joinLobby', socket.id);
			}

		} else if (newState && !newState.lessonIsNew) {

			socket.emit('checkPin', newState.pinAttempt.toString())
			console.log(newState.pinAttempt)

		} else if (!newState) {
			socket.emit('joinLobby', socket.id);
		}
	}

	listen() {
		socket.on('updateLobby', (roomData) => {
			this.handleStudentUpdate(roomData);
		})
		socket.on('pinFail', () => {
			this.props.history.push({
			pathname: '/',
			state: {
				error: true
				}
			});
		})
		socket.on('pageChanged', (newPage) => {
			let prevPage = this.state.leadPage; 
			this.setState({leadPage: newPage})
			if(!this.state.isTeacher) {
				if (prevPage === this.state.clientPage) {
					this.setState({clientPage: newPage})
				}				
			}
		})
		socket.on('noRoom', () => {
			this.props.history.push({
				pathname: '/',
			});
		})
		socket.on('studentChange', (studentData) => {
			this.setState({studentData: studentData})
		})
	}

	componentDidUpdate(prevProps, prevState) {
			// console.log(prevState.lessonId, this.state.lessonId)
			if (prevState.lessonId !== this.state.lessonId) {
				this.loadLesson();
			}
	}

	//called when new student enters
	handleStudentUpdate(roomData) {
		this.setState({ 
			studentData: roomData.studentData, 
			pin: roomData.pin, 
			lessonId: roomData.lessonId, 
			roomId: roomData.roomId, 
			leadPage: roomData.leadPage
		})
		this.props.sendPin(roomData.pin)
	}

	componentWillUnmount() {
		socket.off('updateLobby')
		socket.off('pinFail')
		socket.off('pageChanged')
		socket.off('noRoom')
		this.props.sendPin("")
	}

	render() {
		let intPanel = ""
		if(this.state.lessonId != null) {
			intPanel = <InterfacePanel 
				clientName={this.state.clientName}
				lessonData={this.state.lessonData}
				roomId={this.state.roomId} 
				pin={this.props.pin}
				// isTeacher={this.state.isTeacher}
				leadPage={this.state.leadPage}
				clientPage={this.state.clientPage}
				pageTurn={this.pageTurn}
			/>
		} else {
			intPanel = <h2> Looking for lesson Id... </h2>
		}

		if (!this.props.location.state) {
			return <h1>How did you get past the hall monitors?!</h1>;
		} else
			return (
				<div className="Lobby">
					{this.state.showNamePopup ? 
						<NamePopup
							text="Enter Your Name!"
							handleNameSubmit={this.handleNameSubmit.bind(this)}
							handleNameChange={this.handleNameChange.bind(this)}
						/>
						: null
					}
					{intPanel}
					<StudentPanel 
						studentData={this.state.studentData} 
						clientName={this.state.clientName} 
					/>

				</div>
			);
	}
}

export {socket};
export default Lobby;
