import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import colors from '../style/colors';

export default class CredentialInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.defaultValue || 'Default value'
		};
	}

	handleOnChange(value) {
		console.log(`new value: ${value}`);
		this.setState({
			value
		});
	}

	get value(){
		return this.state.value;
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.iconContainer}>
					<Icon name={this.props.icon} style={styles.icon} />
				</View>
				<TextInput
					style={styles.textInput}
					onChangeText={this.handleOnChange.bind(this)}
					value={this.state.value}
					{...(this.props.secure ? { secureTextEntry: true } : {keyboardType: "email-address"})}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: 35,
		flexDirection: 'row',
		borderWidth: StyleSheet.hairlineWidth * 2,
		borderColor: colors.darkGrey,
		marginVertical: 5
	},
	iconContainer: {
		height: 35,
		paddingHorizontal: 10,
		justifyContent: 'center',
		backgroundColor: colors.purple
	},
	icon:{
		fontSize: 18,
		color: colors.white
	},
	textInput: {
		fontSize: 18,
		color: colors.darkPurple,
		flex: 1,
		paddingVertical: 0,
		paddingHorizontal: 10,
		textAlign: 'left',
		backgroundColor: colors.white,
		height: 35,
		lineHeight: 35
	}
});

CredentialInput.propTypes = {
	icon: PropTypes.string.isRequired,
	secure: PropTypes.bool,
	defaultValue: PropTypes.string
};
