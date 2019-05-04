import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../style/colors';
import PropTypes from 'prop-types';

const MenuButton = ({ onPress }) => {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<Icon name="bars" style={styles.icon} />
		</TouchableOpacity>
	);
};

export default MenuButton;

MenuButton.propTypes = {
	onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	container: {},
	icon: {
		fontSize: 36,
		color: colors.purple
	}
});
