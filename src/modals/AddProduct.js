import React, { Component } from 'react';
import { Text, View, Modal, TouchableOpacity, TextInput, StyleSheet, ToastAndroid } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../style/colors';
import { HorizontalSeparator, RoundButton } from '../components';

export default class AddProductModal extends Component {
	constructor(props) {
		super(props);
		this.state = { visible: false };
	}

	isValidQuantity(quantity) {
		if (isNaN(quantity)) return false;
		if (quantity < 1 || quantity > 10) return false;
		return true;
	}

	_handleNameChange(name) {
		this.setState({ name });
	}

	_handlePriceChange(price) {
		this.setState({ price });
	}

	_handlePriceBlur() {
		let price = parseFloat(this.state.price);
		if (isNaN(price)) {
			this.setState({ price: '' });
			ToastAndroid.show('Invalid price', ToastAndroid.SHORT);
		} else {
			this.setState({ price: price.toFixed(2) });
		}
	}

	_handleQuantityChange(quantity) {
		this.setState({ quantity });
	}

	_handleQuantityBlur() {
		let quantity = parseInt(this.state.quantity);
		if (!this.isValidQuantity(quantity)) {
			this.setState({ quantity: '' });
			ToastAndroid.show('Invalid quantity', ToastAndroid.SHORT);
		} else {
			this.setState({ quantity: String(quantity) });
		}
	}

	show() {
		this.setState({ visible: true });
	}

	hide() {
		this.setState({ visible: false });
	}

	_handleAddProduct() {
		const product = {
			barcode: this.state.barcode,
			name: this.state.name,
			price: parseFloat(this.state.price),
			quantity: parseInt(this.state.quantity)
		};
		this.props.onAddProduct(product);
	}

	render() {
		return (
			<Modal
				style={styles.modal}
				visible={this.state.visible}
				animationType={'fade'}
				transparent={true}
				onRequestClose={this.hide.bind(this)}>
				<TouchableOpacity activeOpacity={0.7} style={styles.background} onPress={this.hide.bind(this)} />
				<View style={styles.container}>
					<View style={styles.barcodeTriggerContainer}>
						<TouchableOpacity style={styles.barcodeTrigger}>
							<Icon name="barcode" style={styles.barcodeIcon} />
						</TouchableOpacity>
						<Text style={styles.triggerLabel}>Scan barcode</Text>
					</View>
					<HorizontalSeparator
						lineColor={colors.purple}
						text="or"
						textColor={colors.darkPurple}
						bgColor={colors.lightGrey}
					/>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							placeholder="Add a name for now"
							placeholderTextColor={colors.purple}
							value={this.state.name}
							onChangeText={this._handleNameChange.bind(this)}
						/>
					</View>
					<View style={styles.inputContainer}>
						<View style={styles.inputWrapper}>
							<Text style={styles.inputLabel}>It costs</Text>
							<TextInput
								style={styles.input}
								placeholder="0.00"
								placeholderTextColor={colors.purple}
								value={this.state.price}
								onChangeText={this._handlePriceChange.bind(this)}
								onBlur={this._handlePriceBlur.bind(this)}
								keyboardType="numeric"
							/>
						</View>
					</View>
					<View style={styles.inputContainer}>
						<View style={styles.inputWrapper}>
							<Text style={styles.inputLabel}>Quantity:</Text>
							<TextInput
								style={styles.input}
								placeholder="1"
								placeholderTextColor={colors.purple}
								value={this.state.quantity}
								onChangeText={this._handleQuantityChange.bind(this)}
								onBlur={this._handleQuantityBlur.bind(this)}
								keyboardType="numeric"
							/>
						</View>
					</View>
					<View style={styles.buttonsContainer}>
						<View style={styles.buttonPlaceholder} />
						<RoundButton
							iconName="cart-plus"
							onPress={this._handleAddProduct.bind(this)}
							containerStyle={{ backgroundColor: colors.darkPurple }}
							large
						/>
						<RoundButton iconName="user-plus" onPress={this._handleAddProduct.bind(this)} />
					</View>
				</View>
			</Modal>
		);
	}
}

AddProductModal.propTypes = {
    session: PropTypes.shape({
		products: PropTypes.array.isRequired,
		participants: PropTypes.array.isRequired
	}).isRequired,
	onAddProduct: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	modal: {
		display: 'flex',
		width: 100 + '%',
		height: 100 + '%',
		backgroundColor: 'transparent'
	},
	background: {
		position: 'absolute',
		flex: 1,
		top: 0,
		left: 0,
		width: 100 + '%',
		height: 100 + '%',
		backgroundColor: colors.darkPurple,
		opacity: 0.7
	},
	container: {
		margin: 20,
		padding: 20,
		backgroundColor: colors.lightGrey
	},
	barcodeTriggerContainer: {
		alignItems: 'center',
		width: 100 + '%',
		justifyContent: 'center'
	},
	barcodeTrigger: {
		paddingHorizontal: 15,
		backgroundColor: colors.darkPurple
	},
	barcodeIcon: {
		color: colors.white,
		fontSize: 80
	},
	triggerLabel: {
		fontSize: 22,
		color: colors.darkPurple
	},
	inputContainer: {
		width: 100 + '%',
		alignItems: 'center',
		marginBottom: 20
	},
	inputLabel: {
		fontSize: 24,
		color: colors.darkPurple,
		marginRight: 5
	},
	input: {
		color: colors.purple,
		fontSize: 24,
		borderColor: colors.purple,
		borderBottomWidth: 1,
		padding: 0,
		margin: 0
	},
	inputWrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonsContainer: {
		marginTop: 20,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly'
	},
	buttonPlaceholder: {
		width: 56,
		height: 56
	}
});
