import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput, Animated, ToastAndroid } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import ParticipantsList from './ParticipantsList';
import colors from '../style/colors';
import { normalizeUserData } from '../lib';

export default class Product extends Component {
	constructor(props) {
		super(props);
		this.state = {
			marginBottom: new Animated.Value(0),
			opacity: 1,
			unitPrice: props.product.unitPrice.toString(),
			quantity: props.product.quantity.toString(),
			name: props.product.product.name
		};
	}

	_handleRemoveButton() {
		this.swipeable.close();
		Animated.timing(this.state.marginBottom, {
			toValue: -56,
			duration: 200
		}).start();
		this.setState({ opacity: 0 });
		this.props.onRemove(this.props.product);
	}

	_handlePriceChange(unitPrice) {
		this.setState({ unitPrice });
	}

	_handlePriceBlur() {
		let price = parseFloat(this.state.unitPrice);
		if (isNaN(price)) {
			this.setState({ unitPrice: this.props.product.unitPrice });
			ToastAndroid.show('Invalid price', ToastAndroid.SHORT);
		} else {
			this.setState({ unitPrice: price.toString() });
			let newProduct = this.props.product;
			newProduct.unitPrice = price;
			this.props.onPatch(newProduct);
		}
	}

	isValidQuantity(quantity) {
		if (isNaN(quantity)) return false;
		if (quantity < 1 || quantity > 10) return false;
		return true;
	}

	isValidName(name) {
		return /[a-zA-Z0-9\- \']/.test(name);
	}

	_handleQuantityChange(quantity) {
		this.setState({ quantity });
	}

	_handleQuantityBlur() {
		let quantity = parseInt(this.state.quantity);
		if (!this.isValidQuantity(quantity)) {
			this.setState({ quantity: this.props.product.quantity });
			ToastAndroid.show('Invalid quantity', ToastAndroid.SHORT);
		} else {
			this.setState({ quantity: quantity.toString() });
			let newProduct = this.props.product;
			newProduct.quantity = quantity;
			this.props.onPatch(newProduct);
		}
	}

	_handleNameChange(name) {
		this.setState({ name });
	}

	_handleNameBlur() {
		if (!this.isValidName(this.state.name)) {
			this.setState({ name: this.props.product.product.name });
			ToastAndroid.show('Invalid name', ToastAndroid.SHORT);
		} else {
			let newProduct = this.props.product;
			newProduct.product.name = this.state.name;
			this.props.onPatch(newProduct);
		}
	}

	renderCloseButton(progress, dragX) {
		const scale = dragX.interpolate({
			inputRange: [ -70, -50, 0 ],
			outputRange: [ 1.2, 1, 0 ],
			extrapolate: 'clamp'
		});
		return (
			<Animated.View style={[ styles.closeIconContainer, { transform: [ { scale } ] } ]}>
				<TouchableOpacity onPress={this._handleRemoveButton.bind(this)}>
					<Icon name="trash-alt" style={styles.closeIcon} />
				</TouchableOpacity>
			</Animated.View>
		);
	}

	render() {
		const { product, participants } = this.props.product;
		return (
			<Swipeable
				containerStyle={{ marginBottom: this.state.marginBottom, opacity: this.state.opacity }}
				ref={(ref) => (this.swipeable = ref)}
				friction={2}
				renderRightActions={this.renderCloseButton.bind(this)}
				leftThreshold={50}>
				<View style={styles.container}>
					<View style={styles.productTitleContainer}>
						{this.props.product.changeName ? (
							<TextInput
								style={styles.productTitle}
								value={this.state.name}
								onChangeText={this._handleNameChange.bind(this)}
								onBlur={this._handleNameBlur.bind(this)}
							/>
						) : (
							<Text style={styles.productTitle}>
								{product.name.length <= 25 ? product.name : product.name.substr(0, 22) + '...'}
							</Text>
						)}
					</View>
					<View style={styles.inputsContainer}>
						<TextInput
							style={styles.priceInput}
							value={this.state.unitPrice}
							keyboardType="numeric"
							onChangeText={this._handlePriceChange.bind(this)}
							onBlur={this._handlePriceBlur.bind(this)}
							selectTextOnFocus
						/>
						<Icon name="times" style={styles.timesIcon} />
						<TextInput
							style={styles.quantityInput}
							value={this.state.quantity}
							keyboardType="numeric"
							onChangeText={this._handleQuantityChange.bind(this)}
							onBlur={this._handleQuantityBlur.bind(this)}
							selectTextOnFocus
						/>
					</View>
					<TouchableOpacity onPress={this.props.onParticipantsTrigger} style={styles.participantsContainer}>
						<ParticipantsList
							participants={participants.map((email) =>
								normalizeUserData(
									this.props.participants.find((other) => other.email === email).profile
								)
							)}
						/>
					</TouchableOpacity>
				</View>
			</Swipeable>
		);
	}
}

Product.propTypes = {
	product: PropTypes.object.isRequired,
	participants: PropTypes.array.isRequired,
	onParticipantsTrigger: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	onPatch: PropTypes.func.isRequired
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
		justifyContent: 'center'
	},
	productTitle: {
		fontSize: 17,
		color: colors.darkPurple
	},
	inputsContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginLeft: 10 + '%',
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
	},
	closeIconContainer: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	closeIcon: {
		fontSize: 24,
		color: colors.purple
	}
});
