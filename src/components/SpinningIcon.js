import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';

export default class SpinningIcon extends Component {
	constructor(props) {
        super(props);
        this.state = {
            spinAngle: new Animated.Value(0)
        }

        this.animation = Animated.timing(this.state.spinAngle, {
			toValue: 1,
			duration: this.props.cycleTime || 1000,
			easing: Easing.linear,
            useNativeDriver: true,
            isInteraction: false
        });
        this.loop = Animated.loop(this.animation);
    }
    
    componentDidMount(){
        this.loop.start();
    }

    componentWillUnmount(){
        this.loop.stop();
    }

	render() {
		const angle = this.state.spinAngle.interpolate({
			inputRange: [ 0, 1 ],
			outputRange: [ '0deg', '360deg' ]
		});
		return (
			<Animated.View
				style={{
					transform: [ { rotate: angle } ]
				}}>
				<Icon {...this.props} />
			</Animated.View>
		);
	}
}

SpinningIcon.propTypes = {
	cycleTime: PropTypes.number,
	name: PropTypes.string.isRequired
};
