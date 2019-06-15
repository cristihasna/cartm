import React, { Component } from 'react';
import { Text, View, Modal, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../style/colors';
import { RNCamera } from 'react-native-camera';
import TextBlocks from '../lib/TextBlocks';

export default class ReceiptScanner extends Component {
	constructor(props) {
		super(props);
		this.state = { visible: false, textBlocks: new TextBlocks(), flashMode: 'off' };
	}

	show() {
		this.setState({ visible: true, textBlocks: new TextBlocks(), flashMode: 'off' });
	}

	hide() {
		this.setState({ visible: false, flashMode: 'off' });
		this.state.textBlocks.getProducts().then(this.props.onReadProducts);
	}

	toggleFlash() {
		this.setState({ flashMode: this.state.flashMode === 'off' ? 'torch' : 'off' });
	}

	_handleRecognizeText(event) {
		this.state.textBlocks.nextBatch(event).then((noOfNewProducts) => {
			if (noOfNewProducts) ToastAndroid.show(`Found ${noOfNewProducts} more products`, ToastAndroid.SHORT);
		})
	}

	_handleBackPress() {
		this.hide();
	}

	_renderCamera() {
		return (
			<View style={styles.container}>
				<View style={styles.cameraPreviewContainer}>
					<Text style={styles.cameraTitle}>Scan the barcode</Text>
					<View style={styles.cameraContainer}>
						<RNCamera
							flashMode={this.state.flashMode}
							ref={(ref) => {
								this.camera = ref;
							}}
							autoFocusPointOfInterest={{ x: 0.5, y: 0.5 }}
							onTextRecognized={this._handleRecognizeText.bind(this)}
							type={RNCamera.Constants.Type.back}
							style={styles.camera}
							captureAudio={false}
						/>
						<View style={[ styles.cameraCover, styles.coverTop ]} />
						<View style={[ styles.cameraCover, styles.coverBottom ]} />
						<View style={[ styles.cameraCover, styles.coverLeft ]} />
						<View style={[ styles.cameraCover, styles.coverRight ]} />
						<View style={styles.barcodeLine} />
						<TouchableOpacity style={styles.flashButtonContainer} onPress={this.toggleFlash.bind(this)}>
							<Icon name="lightbulb" style={styles.flashIcon} />
						</TouchableOpacity>
					</View>
					<Text style={styles.caption}>Make the receipt as clear as possible</Text>
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
				{this._renderCamera()}
			</Modal>
		);
	}
}

ReceiptScanner.propTypes = {
	onReadProducts: PropTypes.func.isRequired
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
	cameraCover: {
		position: 'absolute',
		backgroundColor: colors.purple,
		opacity: 0.5
	},
	coverTop: {
		width: 100 + '%',
		height: 5 + '%',
		top: 0
	},
	coverBottom: {
		width: 100 + '%',
		height: 15 + '%',
		bottom: 0
	},
	coverLeft: {
		width: 5 + '%',
		height: 80 + '%',
		top: 5 + '%'
	},
	coverRight: {
		width: 5 + '%',
		height: 80 + '%',
		top: 5 + '%',
		right: 0
	},
	cameraTitle: {
		fontSize: 28,
		textAlign: 'center',
		marginTop: -10,
		marginBottom: 10,
		color: colors.purple
	},
	caption: {
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
	flashButtonContainer: {
		position: 'absolute',
		bottom: 3 + '%',
		left: 50 + '%',
		marginLeft: -25,
		height: 50,
		width: 50,
		backgroundColor: colors.white,
		borderRadius: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	flashIcon: {
		fontSize: 24,
		color: colors.purple
	}
});
