import React, { Component } from 'react';
import { AsyncStorage, ToastAndroid } from 'react-native';
import ReceiptPresentational from './ReceiptPresentational';
import UUID from 'react-native-uuid';
import { connect } from 'react-redux';
import { resetReceipt, updateReceipt } from '../redux/actions/receiptActions';

class Receipt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		};
		this.stringifiedState = JSON.stringify({
			products: this.props.products,
			participants: this.props.participants
		});
	}

	saveToStorage() {
		// save current instance of the receipt
		const stringifiedProducts = JSON.stringify(this.props.products);
		const stringifiedParticipants = JSON.stringify(this.props.participants);
		AsyncStorage.multiSet([ [ 'rProducts', stringifiedProducts ], [ 'rParticipants', stringifiedParticipants ] ])
			.then(() => ToastAndroid.show('Receipt autosaved', ToastAndroid.SHORT))
			.catch((err) => console.log(err));
	}

	computeDebts(products) {
		const getTotalCost = (email, products) => {
			let totalCost = 0;
			for (let product of products) {
				if (product.participants.length > 0 && product.participants.indexOf(email) > -1)
					totalCost += product.unitPrice * product.quantity / product.participants.length;
			}
			return totalCost;
		};

		let participants = this.props.participants;
		participants.forEach((participant) => {
			participant.debt = getTotalCost(participant.email, products);
		});

		return participants;
	}

	componentDidMount() {
		// trigger refreshControl preloader
		this.setState({ loading: true });

		// check if there is a saved instance of a receipt
		AsyncStorage.multiGet([ 'rProducts', 'rParticipants' ])
			.then(([ [ a, stringifiedProducts ], [ b, stringifiedParticipants ] ]) => {
				if (stringifiedProducts && stringifiedParticipants) {
					// retreiving saved instance of receipt
					products = JSON.parse(stringifiedProducts);
					participants = JSON.parse(stringifiedParticipants);
					this.props.updateReceipt({ products, participants });
					this.setState({ loading: false });
				} else this.setState({ loading: false });
			})
			.catch((err) => {
				console.log(err);
				this.setState({ loading: false });
			});

		this.autosaving = setInterval(() => {
			const newStringifiedState = JSON.stringify({
				products: this.props.products,
				participants: this.props.participants
			});
			// save to storage only if new changes occured
			if (newStringifiedState !== this.stringifiedState) {
				this.stringifiedState = newStringifiedState;
				this.saveToStorage();
			}
		}, 1000 * 60 /* save once a minute */);
	}

	componentWillUnmount() {
		clearInterval(this.autosaving);
		this.saveToStorage();
	}

	patchProduct(product) {
		let products = this.props.products;
		const productIndex = products.findIndex((other) => product._id === other._id);

		// check if product still exists
		if (productIndex === -1) return;
		products[productIndex] = product;
		const participants = this.computeDebts(products);
		this.props.updateReceipt({ products, participants });
	}

	removeProduct(product) {
		let products = this.props.products.filter((other) => other._id !== product._id);
		const participants = this.computeDebts(products);
		this.props.updateReceipt({ products, participants });
	}

	reset() {
		this.props.resetReceipt();
	}

	addEmptyProduct() {
		const newProduct = {
			product: {
				barcode: null,
				name: 'Product'
			},
			changeName: true,
			_id: UUID.v1(),
			participants: this.props.participants.map((_) => _.email),
			unitPrice: 1.5,
			quantity: 1
		};
		const products = this.props.products.concat(newProduct);
		const participants = this.computeDebts(products);
		this.props.updateReceipt({ products, participants });
	}

	shouldComponentUpdate(newProps) {
		return true;
	}

	addProducts(newProducts) {
		let products = this.props.products;
		for (let product of newProducts) {
			product.participants = this.props.participants.map((_) => _.email);

			product.changeName = true;
			products.push(product);
		}
		const participants = this.computeDebts(products);
		this.props.updateReceipt({ products, participants });
	}

	addSessionParticipant(participant) {
		const newParticipant = {
			payed: 0,
			debt: 0,
			_id: UUID.v1(),
			profile: participant,
			email: participant.email
		};

		this.props.updateReceipt({
			participants: this.props.participants.concat(newParticipant),
			products: this.props.products
		});
	}

	removeSessionParticipant(participant) {
		// remove participant from each product;
		let products = this.props.products;
		products.forEach((product) => {
			product.participants = product.participants.filter((other) => other !== participant.email);
		});

		const participants = this.computeDebts(products);
		this.props.updateReceipt({
			participants: participants.filter((other) => other.email !== participant.email),
			products
		});
	}

	addProductParticipant(product, participant) {
		let productIndex = this.props.products.findIndex((other) => other._id === product._id);
		// check if product no longer exists
		if (productIndex === -1) return;
		let products = this.props.products;
		products[productIndex].participants = products[productIndex].participants.concat(participant.profile);
		const participants = this.computeDebts(products);
		this.props.updateReceipt({ products, participants });
	}

	removeProductParticipant(product, participant) {
		let productIndex = this.props.products.findIndex((other) => other._id === product._id);

		// check if product no longer exists
		if (productIndex === -1) return;
		let products = this.props.products;
		products[productIndex].participants = products[productIndex].participants.filter(
			(other) => other.email !== participant.email
		);
		const participants = this.computeDebts(products);
		this.props.updateReceipt({ products, participants });
	}

	render() {
		return (
			<ReceiptPresentational
				loading={this.props.loading || this.state.loading}
				navigation={this.props.navigation}
				products={this.props.products}
				participants={this.props.participants}
				onRemoveProduct={this.removeProduct.bind(this)}
				onPatchProduct={this.patchProduct.bind(this)}
				addSessionParticipant={this.addSessionParticipant.bind(this)}
				removeSessionParticipant={this.removeSessionParticipant.bind(this)}
				addProductParticipant={this.addProductParticipant.bind(this)}
				removeProductParticipant={this.removeProductParticipant.bind(this)}
				addEmptyProduct={this.addEmptyProduct.bind(this)}
				addProducts={this.addProducts.bind(this)}
				onReset={this.reset.bind(this)}
			/>
		);
	}
}

const mapStateToProps = (state) => ({
	login: state.login,
	receipt: state.receipt,
	participants: state.receipt.participants,
	products: state.receipt.products
});

export default connect(mapStateToProps, {
	resetReceipt,
	updateReceipt
})(Receipt);
