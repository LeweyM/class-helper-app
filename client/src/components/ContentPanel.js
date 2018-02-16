// ContentPanel.js

import React from "react";
import { Textfit } from 'react-textfit';

//it might not be necessary to use state here, this could all be props

class ContentPanel extends React.Component {

	render() {

		return (
			<Textfit mode="multi" className='content-wrapper'>
				{this.props.content}
			</Textfit>
		)
	}
}

export default ContentPanel;
