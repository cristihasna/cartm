import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ToastAndroid, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { MenuButton, RoundButton, Product } from '../components';
import { AddProduct } from '../modals';
import { leaveSession, addProduct } from '../redux/actions/sessionActions';
import { connect } from 'react-redux';
import colors from '../style/colors';
import { normalizeUserData } from '../lib';

const UserListButton = ({ onPress }) => {
	return (
		<TouchableOpacity style={styles.userListButtonContainer} onPress={onPress}>
			<Icon name="users-cog" style={styles.userListButtonIcon} />
		</TouchableOpacity>
	);
};

class CurrentSession extends Component {
	constructor(props) {
		super(props);
		this.addProductModal = React.createRef();
	}

	_showAddProductModal() {
		console.log('show modal');
		this.addProductModal.current.show();
	}

	_handleAddProduct(product) {
		console.log('new product:', product);
		console.log(this.props.addProduct);
		if (product.name && product.price && product.quantity) {
			this.props.addProduct(product);
			this.addProductModal.current.hide();
		} else {
			ToastAndroid.show('Product is not valid', ToastAndroid.LONG);
		}
	}

	render() {
		const emptyCart = (
			<View style={styles.emptyCartContainer}>
				<Text style={styles.description}>
					Your current shopping cart is currently empty. Start adding products to this session.
				</Text>
				<View style={styles.emptyCartButtonsContainer}>
					<RoundButton iconName={'cart-plus'} onPress={this._showAddProductModal.bind(this)} large />
					<RoundButton
						iconName="times"
						onPress={() => this.props.leaveSession(this.props.navigation)}
						containerStyle={{ marginTop: 25 }}
					/>
				</View>
			</View>
		);
		const productsCart = this.props.session ? (
			<View style={styles.cartContainer}>
				<FlatList
					style={styles.productsContainer}
					data={this.props.session.products}
					keyExtractor={(product) => product._id}
					renderItem={({ item }) => {
						return (
							<Product
								name={item.product.name}
								unitPrice={item.unitPrice}
								quantity={item.quantity}
								participants={item.participants.map((participant) =>
									normalizeUserData(
										this.props.session.participants.find((other) => other.email === participant)
											.profile
									)
								)}
								onPriceChange={(price) => console.log(`new price: ${price}`)}
								onQuantityChange={(quantity) => console.log(`new quantity: ${quantity}`)}
								onTitleTrigger={() => console.log('title trigged')}
								onParticipantsTrigger={() => console.log('participants triggered')}
							/>
						);
					}}
				/>
				<View style={styles.productsButtonsGroup}>
					<View style={styles.productsButtonsWrapper}>
						<RoundButton iconName="times" onPress={() => this.props.leaveSession(this.props.navigation)} />
						<RoundButton iconName="cart-plus" onPress={this._showAddProductModal.bind(this)} large={true} />
						<RoundButton iconName="credit-card" onPress={() => console.warn('summary')} />
					</View>
				</View>
			</View>
		) : null;
		return (
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<MenuButton onPress={() => this.props.navigation.toggleDrawer()} logo />
					<UserListButton onPress={() => console.log('pressed')} />
				</View>
				{this.props.session && this.props.session.products.length === 0 ? emptyCart : productsCart}
				<AddProduct ref={this.addProductModal} onAddProduct={this._handleAddProduct.bind(this)} />
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	login: state.login,
	session: state.session
});

export default connect(mapStateToProps, { leaveSession, addProduct })(CurrentSession);

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
	description: {
		paddingHorizontal: 40,
		textAlign: 'center',
		color: colors.darkPurple,
		fontSize: 20
	},
	emptyCartContainer: {
		flex: 1,
		paddingTop: 20 + '%'
	},
	emptyCartButtonsContainer: {
		display: 'flex',
		width: 100 + '%',
		alignItems: 'center',
		marginTop: 75
	},
	cartContainer: {
		flex: 1,
		paddingTop: 20,
		paddingHorizontal: 15
	},
	productsContainer: {
		flex: 1,
		alignSelf: 'stretch'
	},
	productsButtonsGroup: {
		height: 128
	},
	productsButtonsWrapper: {
		flex: 1,
		height: 100 + '%',
		width: 100 + '%',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center'
	},
	userListButtonIcon: {
		fontSize: 36,
		color: colors.purple
	}
});
