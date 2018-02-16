// ProgressBar.js

import React from "react";
import Icon from "react-icons-kit";
import { circleDown } from 'react-icons-kit/icomoon/circleDown';

class ProgressBar extends React.Component {

	generatePercentageStr(contentLength, clientPage) {
		const point = 100 / (contentLength - 1)
		const str = (point * clientPage).toString()
		return (str + '%')
	}

	render() {

		const markerStyle = {
			left: this.generatePercentageStr(this.props.contentLength, this.props.clientPage)
		}
		const barStyle = {
			width: this.generatePercentageStr(this.props.contentLength, this.props.leadPage)
		}

		return (
			<div className='progressWrapper'>
				<div className='markerWrapper'>
					<Icon className='marker' style={markerStyle} icon={circleDown} />
				</div>
				<div className="barContainer">
					<div className="bar" style={barStyle}></div>
				</div>
			</div>
			)
	}

}

export default ProgressBar