import React, { Component } from 'react';
import { AsyncStorage, ToastAndroid } from 'react-native';
import ReceiptPresentational from './ReceiptPresentational';

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

    patchProduct(product){
        console.log(product);
    }

    removeProduct(product){
        console.log(product);
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
			participants: [],
			unitPrice: 1,
			quantity: 1
		};
		this.setState({ products: this.state.products.concat(newProduct) });
	}

	render() {
		return (
			<ReceiptPresentational
				{...this.props}
				{...this.state}
				onRemoveProduct={this.removeProduct.bind(this)}
				onPatchProduct={this.patchProduct.bind(this)}
				addEmptyProduct={this.addEmptyProduct.bind(this)}
				onReset={this.reset.bind(this)}
			/>
		);
	}
}

export default Receipt;
