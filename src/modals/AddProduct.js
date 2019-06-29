import React, { Component } from 'react';
import {
	Text,
	View,
	Modal,
	TouchableOpacity,
	TextInput,
	Image,
	StyleSheet,
	ToastAndroid,
	KeyboardAvoidingView,
	Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../style/colors';
import { normalizeUserData, fetchOpenFoodFactsAPI, fetchProducts } from '../lib';
import { HorizontalSeparator, RoundButton, ParticipantsList, SpinningIcon } from '../components';
import { RNCamera } from 'react-native-camera';

const nutriscores = {
	a: require('../../assets/nutriscore_a.png'),
	b: require('../../assets/nutriscore_b.png'),
	c: require('../../assets/nutriscore_c.png'),
	d: require('../../assets/nutriscore_d.png'),
	e: require('../../assets/nutriscore_e.png')
};

const nova_group = {
	'1': require('../../assets/nova_1.png'),
	'2': require('../../assets/nova_2.png'),
	'3': require('../../assets/nova_3.png'),
	'4': require('../../assets/nova_4.png')
};

const NutrientLevels = ({ nutrients }) => {
	let levels = [];
	const circleColors = {
		high: colors.googleColor,
		moderate: colors.darkPurple,
		low: colors.purple
	};
	for (let key of Object.keys(nutrients))
		levels.push(
			<View key={key} style={styles.offNutrientContainer}>
				<Icon
					name="circle"
					style={{ fontSize: 30, color: circleColors[nutrients[key]], marginRight: 10 }}
					solid
				/>
				<Text style={styles.offNutrient}>{key.replace('-', ' ')}</Text>
				<Icon
					name="long-arrow-alt-right"
					style={{ fontSize: 20, color: colors.purple, marginHorizontal: 10 }}
				/>
				<Text style={[ styles.offNutrient, { fontWeight: 'bold' } ]}>{nutrients[key]}</Text>
			</View>
		);
	return (
		<View style={{ marginBottom: 20, marginTop: 10 }}>
			{levels.length ? levels : <Text style={[ styles.offNutrient, { fontWeight: 'bold' } ]}>not specified</Text>}
		</View>
	);
};

export default class AddProductModal extends Component {
	constructor(props) {
		super(props);
		this.state = { visible: false, quantity: '1', users: [], showCamera: false };
	}

	isValidQuantity(quantity) {
		if (isNaN(quantity)) return false;
		if (quantity < 1 || quantity > 10) return false;
		return true;
	}

	_initCamera() {
		this.setState({ showCamera: true });
	}

	_handleBarcodeRead(e) {
		const barcode = e.data;
		// fetch open food facts data
		fetchOpenFoodFactsAPI(barcode)
			.then(async (data) => {
				let currentState = this.state;
				if (data && data.name) {
					currentState.openFoodFactsData = data;
					currentState.name = data.name;
					currentState.showCamera = false;
					currentState.barcode = barcode;
					
					// fetch other instances of this product, for unit price references
					const product = await fetchProducts(data.name);
					if (product) currentState.price = '' + product.unitPrice.toFixed(2);
				} else {
					ToastAndroid.show(`Could not find any product for  '${barcode}'`, ToastAndroid.LONG);
				}
				this.setState(currentState);
			})
			.catch((e) => {});
	}

	_handleBarcodeInput(e) {
		const data = e.nativeEvent.text;
		this._handleBarcodeRead({ data });
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

	addParticipant(participant) {
		const newParticipantsList = this.state.users.concat(participant);
		this.setState({ users: newParticipantsList });
	}

	removeParticipant(participant) {
		const newParticipantsList = this.state.users.filter((other) => other.email !== participant.email);
		this.setState({ users: newParticipantsList });
	}

	show() {
		this.setState({
			visible: true,
			price: undefined,
			name: undefined,
			barcode: undefined,
			quantity: '1',
			openFoodFactsData: undefined,
			loading: false,
		});
	}

	hide() {
		this.setState({ visible: false });
	}

	_handleBackPress() {
		if (this.state.showCamera) this.setState({ showCamera: false });
		else this.setState({ visible: false });
	}
	_handleAddProduct() {
		const product = {
			barcode: this.state.barcode,
			name: this.state.name,
			price: parseFloat(this.state.price),
			quantity: parseInt(this.state.quantity),
			participants: this.state.users.length ? this.state.users.map((participant) => participant.email) : undefined
		};
		this.props.onAddProduct(product);
	}

	_renderCamera() {
		return (
			<View style={styles.container}>
				<View style={styles.cameraPreviewContainer}>
					<Text style={styles.cameraTitle}>Scan the barcode</Text>
					<View style={styles.cameraContainer}>
						<RNCamera
							ref={(ref) => {
								this.camera = ref;
							}}
							type={RNCamera.Constants.Type.back}
							style={styles.camera}
							onBarCodeRead={this._handleBarcodeRead.bind(this)}
							captureAudio={false}
						/>
						<View style={[ styles.cameraCover, styles.coverTop ]} />
						<View style={[ styles.cameraCover, styles.coverBottom ]} />
						<View style={[ styles.cameraCover, styles.coverLeft ]} />
						<View style={[ styles.cameraCover, styles.coverRight ]} />
						<View style={styles.barcodeLine} />
					</View>
					<Text style={styles.barcodeCaption}>Having Trouble?</Text>
					<Text style={styles.barcodeCaption}>Manually enter the code bellow</Text>
					<KeyboardAvoidingView behavior="padding">
						<TextInput
							keyboardType="number-pad"
							style={styles.barcodeInput}
							placeholder="barcode"
							maxLength={13}
							onEndEditing={this._handleBarcodeInput.bind(this)}
							placeholderTextColor={colors.purple}
						/>
					</KeyboardAvoidingView>
				</View>
			</View>
		);
	}

	_renderOpenFoodFacts() {
		const containerStyle = {
			marginLeft: 10,
			flex: 1,
			flexDirection: 'column'
		};
		return (
			<React.Fragment>
				<View style={[ styles.offHeader ]}>
					<Image
						source={{ uri: this.state.openFoodFactsData.image_url }}
						resizeMode={'contain'}
						style={{ width: Dimensions.get('window').width / 4, height: 100, backgroundColor: colors.white }}
					/>
					<View style={containerStyle}>
						<Text style={styles.offName}>{this.state.name}</Text>
						<View style={styles.offImages}>
							<Image
								style={{ height: 50, width: 90 }}
								resizeMode="contain"
								source={nutriscores[this.state.openFoodFactsData.nutrition_grade]}
							/>
							<Image
								style={{ height: 50, width: 30 }}
								resizeMode="contain"
								source={nova_group[this.state.openFoodFactsData.nova_group]}
							/>
						</View>
					</View>
				</View>
				<View style={{ marginTop: 10 }}>
					<Text style={styles.offNutrient}>
						Allergens:{' '}
						<Text style={{ fontWeight: 'bold' }}>
							{this.state.openFoodFactsData.allergens || 'not specified'}
						</Text>
					</Text>
					<Text style={[ styles.offNutrient, { marginTop: 10 } ]}>Nutrient levels:</Text>
					{this.state.openFoodFactsData.nutrient_levels && (
						<NutrientLevels nutrients={this.state.openFoodFactsData.nutrient_levels} />
					)}
				</View>
			</React.Fragment>
		);
	}

	_renderModalContent() {
		const manualInput = this.state.openFoodFactsData ? (
			this._renderOpenFoodFacts()
		) : (
			<React.Fragment>
				<View style={styles.barcodeTriggerContainer}>
					<TouchableOpacity onPress={this._initCamera.bind(this)} style={styles.barcodeTrigger}>
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
			</React.Fragment>
		);
		return (
			<View style={styles.container}>
				{this.state.loading ? (
					<View style={styles.loadingIconContainer}>
						<SpinningIcon name="circle-notch" style={styles.loadingIcon} cycleTime={2500} />
					</View>
				) : (
					manualInput
				)}
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
							selectTextOnFocus
						/>
						<Text style={[styles.inputLabel, {
							marginLeft: 5,
							fontSize: 16,
							color: colors.purple,
							fontWeight: 'bold'
						}]}>RON</Text>
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
					<View style={styles.buttonPlaceholder}>
						<ParticipantsList
							participants={this.state.users.map((participant) => normalizeUserData(participant.profile))}
						/>
					</View>
					<RoundButton
						iconName="cart-plus"
						onPress={this._handleAddProduct.bind(this)}
						containerStyle={{ backgroundColor: colors.darkPurple }}
						large
					/>
					<RoundButton
						iconName="user-plus"
						onPress={() =>
							this.props.onParticipantsTrigger({
								participants: this.state.users.map((p) => p.email)
							})}
					/>
				</View>
			</View>
		);
	}

	render() {
		return (
			<Modal
				style={styles.modal}
				visible={this.state.visible}
				animationType={'fade'}
				transparent={true}
				onRequestClose={this._handleBackPress.bind(this)}>
				<TouchableOpacity activeOpacity={0.7} style={styles.background} onPress={this.hide.bind(this)} />
				{this.state.showCamera ? this._renderCamera() : this._renderModalContent()}
			</Modal>
		);
	}
}

AddProductModal.propTypes = {
	onAddProduct: PropTypes.func.isRequired,
	onParticipantsTrigger: PropTypes.func.isRequired
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
	offHeader: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	offImage: {
		height: 100,
		width: (Dimensions.get('window').width - 80) / 2
	},
	offImages: {
		marginTop: 5,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	offName: {
		fontSize: 24,
		color: colors.purple
	},
	offNutrientContainer: {
		marginVertical: 5,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	offNutrient: {
		color: colors.purple,
		fontSize: 22
	},
	cameraPreviewContainer: {
		height: 100 + '%',
		height: 100 + '%'
		// marginVertical: -20
	},
	cameraContainer: {
		flex: 1,
		marginHorizontal: -20,
		marginBottom: 10,
		backgroundColor: colors.black,
		overflow: 'hidden'
	},
	camera: {
		flex: 1,
		backgroundColor: colors.white
	},
	barcodeLine: {
		position: 'absolute',
		backgroundColor: colors.googleColor,
		width: 60 + '%',
		height: 1,
		top: 50 + '%',
		left: 20 + '%'
	},
	cameraCover: {
		position: 'absolute',
		backgroundColor: colors.purple,
		opacity: 0.5
	},
	coverTop: {
		width: 100 + '%',
		height: 15 + '%',
		top: 0
	},
	coverBottom: {
		width: 100 + '%',
		height: 15 + '%',
		bottom: 0
	},
	coverLeft: {
		width: 5 + '%',
		height: 70 + '%',
		top: 15 + '%'
	},
	coverRight: {
		width: 5 + '%',
		height: 70 + '%',
		top: 15 + '%',
		right: 0
	},
	cameraTitle: {
		fontSize: 28,
		textAlign: 'center',
		marginTop: -10,
		marginBottom: 10,
		color: colors.purple
	},
	barcodeCaption: {
		fontSize: 18,
		textAlign: 'center',
		color: colors.purple
	},
	barcodeInput: {
		borderBottomColor: colors.purple,
		borderBottomWidth: 1,
		fontSize: 24,
		color: colors.purple,
		letterSpacing: 5,
		textAlign: 'center'
	},
	loadingIconContainer: {
		width: 100 + '%',
		paddingVertical: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loadingIcon: {
		color: colors.purple,
		fontSize: 56
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
		height: 56,
		paddingRight: 0,
		justifyContent: 'center'
	}
});
