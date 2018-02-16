// InterfacePanel.js

import React from "react";
import TurnPageButton from "./TurnPageButton";
import ContentPanel from "./ContentPanel";
import ProgressBar from "./ProgressBar"

//todo
//make an API call here to get the activity content object. //done!

class InterfacePanel extends React.Component {

	render() {
		return (
			<div>
				<h2>Lesson Title: {this.props.lessonData.title}</h2>

				{this.props.clientName ?
					<ProgressBar 
						leadPage={this.props.leadPage} 
						contentLength={this.props.lessonData.content.length} 
						clientPage={this.props.clientPage}
					/>
					: null
				}
				<ContentPanel content={this.props.lessonData.content[this.props.clientPage]}/>

				<div className='button-wrapper'>
					<TurnPageButton dir="previous" callback={this.props.pageTurn}/>
					<TurnPageButton dir="next" callback={this.props.pageTurn}/>
				</div>
			</div>
		);
	}
}

export default InterfacePanel;
