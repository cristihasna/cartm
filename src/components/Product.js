import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import ParticipantsList from './ParticipantsList';
import colors from '../style/colors';

export default class Product extends Component {
    render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.props.onTitleTrigger} style={styles.productTitleContainer}>
					<Text style={styles.productTitle}>
						{this.props.name.length <= 25 ? this.props.name : this.props.name.substr(0, 22) + '...'}
					</Text>
				</TouchableOpacity>
				<View style={styles.inputsContainer}>
					<TextInput
						style={styles.priceInput}
						value={this.props.unitPrice.toString()}
						keyboardType="numeric"
						onChange={this.props.onPriceChange}
					/>
					<Icon name="times" style={styles.timesIcon}/>
					<TextInput
						style={styles.quantityInput}
						value={this.props.quantity.toString()}
						keyboardType="numeric"
						onChange={this.props.onQuantityChange}
					/>
				</View>
				<TouchableOpacity onPress={this.props.onParticipantsTrigger} style={styles.participantsContainer}>
					<ParticipantsList participants={this.props.participants} />
				</TouchableOpacity>
			</View>
		);
	}
}

Product.propTypes = {
	name: PropTypes.string.isRequired,
	unitPrice: PropTypes.number.isRequired,
	quantity: PropTypes.number.isRequired,
	participants: PropTypes.array.isRequired,
	onPriceChange: PropTypes.func.isRequired,
	onQuantityChange: PropTypes.func.isRequired,
	onTitleTrigger: PropTypes.func.isRequired,
	onParticipantsTrigger: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		width: 100 + '%',
        height: 50,
        justifyContent: 'center', 
		paddingHorizontal: 10,
		marginVertical: 3,
		backgroundColor: colors.mediumGrey
	},
	productTitleContainer: {
        position: 'absolute',
        left: 10,
        height: 50,
        justifyContent: 'center',
    },
    productTitle: {
        fontSize: 17,
        color: colors.darkPurple,    
    },
	inputsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginLeft: 20 + '%',
        width: 100
	},
	priceInput: {
        fontSize: 18,
		fontWeight: '500',
		color: colors.darkPurple
    },
    timesIcon: {
        fontSize: 10,
        color: colors.darkGrey
    },
    quantityInput: {
		fontSize: 18,
		fontWeight: '500',
		color: colors.darkPurple
    },
    participantsContainer: {
        position: 'absolute',
        right: 10,
        height: 50,
        justifyContent: 'center'
    }
});
