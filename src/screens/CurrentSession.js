import React, { Component } from 'react';
import { View, Text, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { MenuButton, RoundButton, CartProductsList } from '../components';
import { AddProduct, SessionParticipantsManager, ProductParticipantsManager } from '../modals';
import { leaveSession, addParticipantToSession, removeParticipantFromSession } from '../redux/actions/sessionActions';
import {
	addProduct,
	patchProduct,
	removeProduct,
	addParticipantToProduct,
	removeParticipantFromProduct
} from '../redux/actions/productActions';
import { connect } from 'react-redux';
import colors from '../style/colors';

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
		this.sessionParticipantsModal = React.createRef();
		this.productParticipantsModal = React.createRef();
		this.newProductParticipantsModal = React.createRef();
	}

	_showAddProductModal() {
		this.addProductModal.current.show();
	}

	_showSessionParticipantsModal() {
		this.sessionParticipantsModal.current.show();
	}

	_showProductParticipantsModal(product) {
		this.productParticipantsModal.current.show(product);
	}

	_showOnModalParticipantsModal(product) {
		this.newProductParticipantsModal.current.show(Object.assign(product));
	}

	_handleAddProduct(product) {
		if (product.name && product.price && product.quantity) {
			this.props.addProduct(product);
			this.addProductModal.current.hide();
		} else {
			ToastAndroid.show('Product is not valid', ToastAndroid.LONG);
		}
	}

	_handlePatchProduct(product) {
		this.props.patchProduct(product);
	}

	_handleRemoveProduct(product) {
		this.props.removeProduct(product);
	}

	_handleAddParticipantToSession(participant) {
		this.props.addParticipantToSession(participant.email);
	}

	_handleRemoveParticipantFromSession(participant) {
		this.props.removeParticipantFromSession(participant.email);
	}

	_handleAddParticipantToProduct(product, participant) {
		this.props.addParticipantToProduct(product, participant.email);
	}

	_handleRemoveParticipantFromProduct(product, participant) {
		this.props.removeParticipantFromProduct(product, participant.email);
	}

	render() {
		if (!this.props.session || !this.props.login) return null;
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
		const productsCart = (
			<View style={styles.cartContainer}>
				<CartProductsList
					products={this.props.session.products}
					participants={this.props.session.participants}
					onRemoveProduct={this._handleRemoveProduct.bind(this)}
					onParticipantsTrigger={this._showProductParticipantsModal.bind(this)}
					onPatchProduct={this._handlePatchProduct.bind(this)}
				/>
				<View style={styles.productsButtonsGroup}>
					<View style={styles.productsButtonsWrapper}>
						<RoundButton iconName="times" onPress={() => this.props.leaveSession(this.props.navigation)} />
						<RoundButton
							iconName={this.props.loading ? 'circle-notch' : 'cart-plus'}
							onPress={this._showAddProductModal.bind(this)}
							large
							{...this.props.loading && { spinning: true }}
						/>
						<RoundButton iconName="credit-card" onPress={() => this.props.navigation.navigate('Summary')} />
					</View>
				</View>
			</View>
		);
		return (
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<MenuButton onPress={() => this.props.navigation.toggleDrawer()} logo />
					<UserListButton onPress={this._showSessionParticipantsModal.bind(this)} />
				</View>
				{this.props.session.products.length === 0 ? emptyCart : productsCart}
				<AddProduct
					ref={this.addProductModal}
					onAddProduct={this._handleAddProduct.bind(this)}
					onParticipantsTrigger={this._showOnModalParticipantsModal.bind(this)}
				/>
				<SessionParticipantsManager
					ref={this.sessionParticipantsModal}
					onAdd={this._handleAddParticipantToSession.bind(this)}
					onRemove={this._handleRemoveParticipantFromSession.bind(this)}
					participants={this.props.session.participants.map(
						(participant) =>
							participant.email === this.props.login.email
								? Object.assign(participant, { isHost: true })
								: participant
					)}
				/>
				<ProductParticipantsManager
					ref={this.productParticipantsModal}
					onAdd={this._handleAddParticipantToProduct.bind(this)}
					onRemove={this._handleRemoveParticipantFromProduct.bind(this)}
					participants={this.props.session.participants}
				/>
				<ProductParticipantsManager
					ref={this.newProductParticipantsModal}
					onAdd={(_, participant) => {
						this.addProductModal.current.addParticipant(participant);
					}}
					onRemove={(_, participant) => this.addProductModal.current.removeParticipant(participant)}
					participants={this.props.session.participants}
				/>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	login: state.login,
	session: state.session,
	loading: state.loading
});

export default connect(mapStateToProps, {
	leaveSession,
	addProduct,
	patchProduct,
	removeProduct,
	addParticipantToSession,
	removeParticipantFromSession,
	addParticipantToProduct,
	removeParticipantFromProduct
})(CurrentSession);

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
