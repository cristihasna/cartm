import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../style/colors';

export default class HorizontalSeparator extends Component {
	render() {
		return (
			<View style={styles.container}>
				<View
					style={[
						styles.line,
						{ backgroundColor: this.props.lineColor }
					]}
				/>
				{this.props.text ? (
					<Text
						style={[
							styles.text,
							{
								backgroundColor: this.props.bgColor || colors.white,
								color: this.props.textColor || colors.black
							}
						]}>
						{this.props.text}
					</Text>
				) : null}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: 100 + '%',
        height: 20,
        marginVertical: 20,
        alignItems: 'center'
	},
	line: {
		height: 1,
        width: 100 + '%',
        marginTop: 9
	},
	text: {
        flex: 1,
        lineHeight: 20,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        fontSize: 16,
        marginTop: -10
	}
});

HorizontalSeparator.propTypes = {
	lineColor: PropTypes.string.isRequired,
	text: PropTypes.string,
	bgColor: PropTypes.string,
	textColor: PropTypes.string
};
