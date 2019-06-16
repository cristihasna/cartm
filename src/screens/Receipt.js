import React, { Component } from 'react';
import { AsyncStorage, ToastAndroid } from 'react-native';
import ReceiptPresentational from './ReceiptPresentational';
import UUID from 'react-native-uuid';
import { connect } from 'react-redux';

class Receipt extends Component {
	constructor(props) {
		super(props);
		const newParticipant = {
			payed: 0,
			debt: 0,
			_id: UUID.v1(),
			profile: this.props.login,
			email: this.props.login.email,
			isHost: true
		};
		this.state = {
			products: [],
			participants: [ newParticipant ],
			loading: false
		};
		this.stringifiedState = JSON.stringify({
			products: this.state.products,
			participants: this.state.participants
		});
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

	computeDebts(products) {
		const getTotalCost = (email, products) => {
			let totalCost = 0;
			for (let product of products) {
				if (product.participants.length > 0 && product.participants.indexOf(email) > -1)
					totalCost += product.unitPrice * product.quantity / product.participants.length;
			}
			return totalCost;
		};

		let participants = this.state.participants;
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
					this.setState({ products, participants, loading: false });
				} else this.setState({ loading: false });
			})
			.catch((err) => {
				console.log(err);
				this.setState({ loading: false });
			});

		this.autosaving = setInterval(() => {
			const newStringifiedState = JSON.stringify({
				products: this.state.products,
				participants: this.state.participants
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
		let products = this.state.products;
		const productIndex = products.findIndex((other) => product._id === other._id);

		// check if product still exists
		if (productIndex === -1) return;
		products[productIndex] = product;
		const participants = this.computeDebts(products);
		this.setState({ products, participants });
	}

	removeProduct(product) {
		let products = this.state.products.filter((other) => other._id !== product._id);
		const participants = this.computeDebts(products);
		this.setState({ products, participants });
	}

	reset() {
		const participants = this.computeDebts(products);
		this.setState({ products: [], participants });
	}

	addEmptyProduct() {
		const newProduct = {
			product: {
				barcode: null,
				name: 'Product'
			},
			changeName: true,
			_id: UUID.v1(),
			participants: this.state.participants.map((_) => _.email),
			unitPrice: 1.5,
			quantity: 1
		};
		const products = this.state.products.concat(newProduct);
		const participants = this.computeDebts(products);
		this.setState({ products, participants });
	}

	async addProducts(newProducts) {
		let products = this.state.products;
		for (let product of newProducts) {
			product.participants = this.state.participants.map((_) => _.email);

			product.changeName = true;
			products.push(product);
		}
		const participants = this.computeDebts(products);
		this.setState({ products, participants });
	}

	addSessionParticipant(participant) {
		const newParticipant = {
			payed: 0,
			debt: 0,
			_id: UUID.v1(),
			profile: participant,
			email: participant.email
		};

		this.setState({ participants: this.state.participants.concat(newParticipant) });
	}

	removeSessionParticipant(participant) {
		// remove participant from each product;
		let products = this.state.products;
		products.forEach((product) => {
			product.participants = product.participants.filter((other) => other !== participant.email);
		});

		const participants = this.computeDebts(products);
		this.setState({
			participants: participants.filter((other) => other.email !== participant.email),
			products
		});
	}

	addProductParticipant(product, participant) {
		let productIndex = this.state.products.findIndex((other) => other._id === product._id);
		// check if product no longer exists
		if (productIndex === -1) return;
		let products = this.state.products;
		products[productIndex].participants = products[productIndex].participants.concat(participant.profile);
		const participants = this.computeDebts(products);
		this.setState({ products, participants });
	}

	removeProductParticipant(product, participant) {
		let productIndex = this.state.products.findIndex((other) => other._id === product._id);

		// check if product no longer exists
		if (productIndex === -1) return;
		let products = this.state.products;
		products[productIndex].participants = products[productIndex].participants.filter(
			(other) => other.email !== participant.email
		);
		const participants = this.computeDebts(products);
		this.setState({ products, participants });
	}

	render() {
		return (
			<ReceiptPresentational
				{...this.props}
				{...this.state}
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
	login: state.login
});

export default connect(mapStateToProps)(Receipt);
