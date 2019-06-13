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
			email: this.props.login.email
		};
		this.state = {
			products: [],
			participants: [ newParticipant ],
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

	patchProduct(product) {
		console.log(product);
		let products = this.state.products;
		const productIndex = products.findIndex((other) => product._id === other._id);

		// check if product still exists
		if (productIndex === -1) return;
		products[productIndex] = product;
		this.setState({ products });
	}

	removeProduct(product) {
		let products = this.state.products.filter((other) => other._id !== product._id);
		this.setState({ products });
	}

	reset() {
		this.setState({ products: [] });
		console.warn('reset');
	}

	addEmptyProduct() {
		const newProduct = {
			product: {
				barcode: null,
				name: 'Product'
			},
			changeName: true,
			_id: UUID.v1(),
			participants: [],
			unitPrice: 1.5,
			quantity: 1
		};
		this.setState({ products: this.state.products.concat(newProduct) });
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
		console.log(products);
		this.setState({
			participants: this.state.participants.filter((other) => other.email !== participant.email),
			products
		});
	}

	addProductParticipant(product, participant) {
		let productIndex = this.state.products.findIndex((other) => other._id === product._id);
		// check if product no longer exists
		if (productIndex === -1) return;
		let products = this.state.products;
		products[productIndex].participants = products[productIndex].participants.concat(participant.profile);
		this.setState({ products });
	}

	removeProductParticipant(product, participant) {
		let productIndex = this.state.products.findIndex((other) => other._id === product._id);

		// check if product no longer exists
		if (productIndex === -1) return;
		let products = this.state.products;
		products[productIndex].participants = products[productIndex].participants.filter(
			(other) => other.email !== participant.email
		);
		this.setState({ products });
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
				onReset={this.reset.bind(this)}
			/>
		);
	}
}

const mapStateToProps = (state) => ({
	login: state.login
});

export default connect(mapStateToProps)(Receipt);
