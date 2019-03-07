import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import colors from '../style/colors';

export default class SocialLoginButton extends Component {
    handleOnPress(e){
        this.props.onClick();
    }

	render() {
		return (
			<View
				style={[
					styles.container,
					this.props.style
				]}>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={this.handleOnPress.bind(this)}
					style={[
						styles.touchable,
						this.props.color ? { backgroundColor: this.props.color } : null
					]}>
					<View style={styles.wrapper}>
						<Icon name={this.props.iconName} style={styles.icon} />
						<Text style={styles.title}>{this.props.title}</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		height: 35
	},
	touchable: {
		width: '100%'
	},
	wrapper: {
		height: '100%',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		color: colors.white
	},
	icon: {
		fontSize: 20,
		marginRight: 10,
		color: colors.white
	},
	title: {
		fontSize: 19,
		textAlign: 'center',
		color: colors.white
	}
});

SocialLoginButton.propTypes = {
	iconName: PropTypes.string,
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	style: PropTypes.object,
	color: PropTypes.string
};
