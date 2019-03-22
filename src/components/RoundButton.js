import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../style/colors';

const RoundButton = ({ iconName, onPress, large, containerStyle, iconStyle }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[ styles.container, large ? styles.containerLarge : null, containerStyle ]}>
			<Icon name={iconName} style={[ styles.icon, large ? styles.iconLarge : null, iconStyle ]} />
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
		flex: 1,
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
    iconLarge:{
        fontSize: 32
    }
});
