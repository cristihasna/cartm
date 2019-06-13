import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { MenuButton, RoundButton, CartProductsList } from '../components';
import { SessionParticipantsManager, ProductParticipantsManager, ReceiptScanner } from '../modals';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../style/colors';

const UserListButton = ({ onPress }) => {
	return (
		<TouchableOpacity style={styles.userListButtonContainer} onPress={onPress}>
			<Icon name="users-cog" style={styles.userListButtonIcon} />
		</TouchableOpacity>
	);
};

export default class ReceiptPresentational extends Component {
	constructor(props) {
		super(props);
	}

	showProductParticipants(product) {
		this.productParticipants.show(product);
	}

	showSessionParticipants() {
		this.sessionParticipants.show();
	}

	showReceiptScanner() {
		this.receiptScanner.show();
	}
	showSummary() {
		console.warn('summary');
	}

	render() {
		// refresh control component
		const {
			loading,
			navigation,
			products,
			participants,
			onRemoveProduct,
			onPatchProduct,
			onReset,
			addEmptyProduct,
			addSessionParticipant,
			removeSessionParticipant,
			addProductParticipant,
			removeProductParticipant
		} = this.props;

		const refreshControl = <RefreshControl refreshing={loading} enabled={false} />;
		return (
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<MenuButton onPress={() => navigation.toggleDrawer()} logo />
					<UserListButton onPress={this.showSessionParticipants.bind(this)} />
				</View>
				<View style={styles.productCartContainer}>
					<CartProductsList
						refreshControl={refreshControl}
						products={products}
						participants={participants}
						onParticipantsTrigger={this.showProductParticipants.bind(this)}
						onRemoveProduct={onRemoveProduct}
						onPatchProduct={onPatchProduct}
					/>
				</View>
				{products.length === 0 ? (
					<View style={styles.emptyCartContainer}>
						<Text style={styles.description}>
							Scan a receipt and get the products, or enter them manually
						</Text>
						<View style={styles.emptyCartButtonsContainer}>
							<RoundButton iconName="receipt" onPress={this.showReceiptScanner.bind(this)} large />
							<RoundButton iconName="edit" onPress={addEmptyProduct} containerStyle={{ marginTop: 25 }} />
						</View>
					</View>
				) : (
					<View style={styles.productsButtonsGroup}>
						<View style={styles.productsButtonsWrapper}>
							<RoundButton iconName="times" onPress={onReset} />
							<RoundButton iconName={'receipt'} onPress={this.showReceiptScanner.bind(this)} />
							<RoundButton iconName={'edit'} onPress={addEmptyProduct} />
							<RoundButton iconName="credit-card" onPress={this.showSummary.bind(this)} />
						</View>
					</View>
				)}
				<ProductParticipantsManager
					ref={(ref) => (this.productParticipants = ref)}
					onAdd={addProductParticipant}
					onRemove={removeProductParticipant}
					participants={participants}
				/>
				<SessionParticipantsManager
					ref={(ref) => (this.sessionParticipants = ref)}
					onAdd={addSessionParticipant}
					onRemove={removeSessionParticipant}
					participants={participants}
				/>
				<ReceiptScanner ref={(ref) => (this.receiptScanner = ref)} />
			</View>
		);
	}
}

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
