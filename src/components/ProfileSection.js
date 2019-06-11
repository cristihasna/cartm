import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../style/colors';
import PropTypes from 'prop-types';

export default class ProfileSection extends Component {
	render() {
		const heading = Array.isArray(this.props.heading) ? this.props.heading : [ this.props.heading ];
		return (
			<View style={[ styles.container, this.props.containerStyle ]}>
				{heading.map((h) => (
					<View key={h.title} style={styles.headerContainer}>
						<Text style={styles.title}>{h.title}</Text>
						{h.right && <Text style={styles.right}>{h.right}</Text>}
					</View>
				))}
				{this.props.children && (
					<View style={[ styles.contentContainer, this.props.childrenStyle ]}>{this.props.children}</View>
				)}
				{this.props.buttonLabel && (
					<TouchableOpacity onPress={this.props.buttonAction} style={styles.button}>
						<Text style={styles.buttonLabel}>{this.props.buttonLabel}</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	}
}

const headingProp = PropTypes.shape({
	title: PropTypes.string.isRequired,
	right: PropTypes.string
});
ProfileSection.propTypes = {
	heading: PropTypes.oneOfType([ PropTypes.arrayOf(headingProp), headingProp ]).isRequired,
	buttonLabel: PropTypes.string,
	buttonAction: PropTypes.func
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 10
	},
	headerContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	title: {
		fontSize: 24,
		color: colors.darkPurple
	},
	right: {
		fontSize: 26,
		fontWeight: 'bold',
		color: colors.purple
	},
	contentContainer: {
		paddingLeft: 20,
		marginLeft: 5,
		marginTop: 5,
		paddingVertical: 10,
		borderLeftWidth: 2,
		borderLeftColor: colors.purple
	},
	button: {
		paddingVertical: 10,
		alignItems: 'center'
	},
	buttonLabel: {
		fontSize: 24,
		color: colors.purple,
		borderBottomWidth: 1,
		borderBottomColor: colors.purple
	}
});
