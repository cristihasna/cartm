import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity, StyleSheet } from 'react-native';
import SpinningIcon from './SpinningIcon';
import PropTypes from 'prop-types';
import colors from '../style/colors';

const RoundButton = ({ iconName, onPress, large, containerStyle, iconStyle, spinning }) => {
	const localStyle = [ styles.icon, large ? styles.iconLarge : null, iconStyle ];

	return (
		<TouchableOpacity
			onPress={onPress}
			style={[ styles.container, large ? styles.containerLarge : null, containerStyle ]}>
			{spinning ? (
				<SpinningIcon name={iconName} style={localStyle} />
			) : (
				<Icon name={iconName} style={localStyle} />
			)}
		</TouchableOpacity>
	);
};

export default RoundButton;

RoundButton.propTypes = {
	iconName: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	large: PropTypes.bool
};

const styles = StyleSheet.create({
	container: {
		width: 56,
		height: 56,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.purple,
		borderRadius: 56
	},
	containerLarge: {
		width: 76,
		height: 76,
		borderRadius: 76
	},
	icon: {
		color: colors.lightGrey,
		fontSize: 24
	},
	iconLarge: {
		fontSize: 32
	}
});
