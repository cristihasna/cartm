import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage, RefreshControl, ToastAndroid } from 'react-native';
import { MenuButton, RoundButton, CartProductsList } from '../components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../style/colors';

const UserListButton = ({ onPress }) => {
	return (
		<TouchableOpacity style={styles.userListButtonContainer} onPress={onPress}>
			<Icon name="users-cog" style={styles.userListButtonIcon} />
		</TouchableOpacity>
	);
};

class Receipt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			participants: [],
			loading: false
		};
	}

	saveToStorage() {
		// save current instance of the receipt
		const stringifiedProducts = JSON.stringify(this.state.products);
		const stringifiedParticipants = JSON.stringify(this.state.participants);
		console.log('Saving to storage: ', this.state.products, this.state.participants);
		AsyncStorage.multiSet([ [ 'rProducts', stringifiedProducts ], [ 'rParticipants', stringifiedParticipants ] ])
			.then(() => ToastAndroid.show('Receipt autosaved', ToastAndroid.SHORT))
			.catch((err) => console.log(err));
	}

	componentDidMount() {
		// trigger refreshControl preloader
		this.setState({ loading: true });

		// check if there is a saved instance of a receipt
		AsyncStorage.multiGet([ 'rProducts', 'rParticipants' ])
			.then(([ [ a, stringifiedProducts ], [ b, stringifiedParticipants ] ]) => {
				console.log(stringifiedProducts, stringifiedParticipants);
				if (stringifiedProducts && stringifiedParticipants) {
					// retreiving saved instance of receipt
					products = JSON.parse(stringifiedProducts);
					participants = JSON.parse(stringifiedParticipants);
					console.log('retrieving from storage', products, participants);
					this.setState({ products, participants, loading: false });
				} else this.setState({ loading: false });
			})
			.catch((err) => {
				console.log(err);
				this.setState({ loading: false });
			});

		this.autosaving = setInterval(() => {
			if (this.props.navigation.state.routeName === 'Receipt') this.saveToStorage();
		}, 1000 * 60 /* save once a minute */);
	}

	componentWillUnmount() {
		clearInterval(this.autosaving);
		this.saveToStorage();
	}

	_showReceiptParticipantsModal() {
		console.warn('show participants modal');
	}

	_showReceiptScanner() {
		console.warn('receipt scanner');
	}

	_handleReset() {
		console.warn('reset');
	}

	_showReceiptSummary() {
		console.warn('receipt summary');
	}

	addEmptyProduct() {
		const newProduct = {
			product: {
				barcode: null,
				name: 'Product'
			},
			participants: [],
			unitPrice: 1,
			quantity: 1
		};
		this.setState({ products: this.state.products.concat(newProduct) });
	}

	render() {
		// refresh control component
		const refreshControl = <RefreshControl refreshing={this.state.loading} enabled={false} />;

		return (
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<MenuButton onPress={() => this.props.navigation.toggleDrawer()} logo />
					<UserListButton onPress={this._showReceiptParticipantsModal.bind(this)} />
				</View>
				<View style={styles.productCartContainer}>
					<CartProductsList
						refreshControl={refreshControl}
						products={this.state.products}
						participants={this.state.participants}
						onParticipantsTrigger={(product) => console.log(product)}
						onRemoveProduct={(product) => console.log(product)}
						onPatchProduct={(product) => console.log(product)}
					/>
				</View>
				{this.state.products.length === 0 ? (
					<View style={styles.emptyCartContainer}>
						<Text style={styles.description}>
							Scan a receipt and get the products, or enter them manually
						</Text>
						<View style={styles.emptyCartButtonsContainer}>
							<RoundButton iconName="receipt" onPress={this._showReceiptScanner.bind(this)} large />
							<RoundButton
								iconName="edit"
								onPress={this.addEmptyProduct.bind(this)}
								containerStyle={{ marginTop: 25 }}
							/>
						</View>
					</View>
				) : (
					<View style={styles.productsButtonsGroup}>
						<View style={styles.productsButtonsWrapper}>
							<RoundButton iconName="times" onPress={this._handleReset.bind(this)} />
							<RoundButton iconName={'receipt'} onPress={this._showReceiptScanner.bind(this)} />
							<RoundButton iconName={'edit'} onPress={this.addEmptyProduct.bind(this)} />
							<RoundButton iconName="credit-card" onPress={this._showReceiptSummary.bind(this)} />
						</View>
					</View>
				)}
			</View>
		);
	}
}

export default Receipt;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: 100 + '%',
		height: 100 + '%',
		backgroundColor: colors.lightGrey
	},
	headerContainer: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	userListButtonIcon: {
		fontSize: 36,
		color: colors.purple
	},
	description: {
		paddingHorizontal: 40,
		textAlign: 'center',
		color: colors.darkPurple,
		fontSize: 20
	},
	emptyCartContainer: {
		flex: 20,
		paddingTop: 20 + '%'
	},
	emptyCartButtonsContainer: {
		display: 'flex',
		width: 100 + '%',
		alignItems: 'center',
		marginTop: 75
	},
	productsButtonsGroup: {
		height: 128
    },
    productCartContainer: {
        flex: 1,
        paddingHorizontal: 20
    },
	productsButtonsWrapper: {
		flex: 1,
		height: 100 + '%',
		width: 100 + '%',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center'
	}
});
