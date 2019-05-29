import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../style/colors';
import PropTypes from 'prop-types';

const logoImage = require('../../assets/logo.png');

const MenuButton = ({ onPress, logo }) => {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<Icon name="bars" style={styles.icon} />
			{logo && <Image source={logoImage} style={styles.logoImage} />}
		</TouchableOpacity>
	);
};

export default MenuButton;

MenuButton.propTypes = {
	onPress: PropTypes.func.isRequired,
	logo: PropTypes.bool
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start'
	},
	icon: {
		fontSize: 36,
		color: colors.purple
	},
	logoImage: {
		height: 32,
		width: 32 * 859 / 256,
		marginVertical: 2,
		marginHorizontal: 10,
		resizeMode: 'contain'
	}
});
