import React, { Component } from 'react';
import { normalizeUserData } from '../lib';
import { FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Product from './Product';

export default class CartProductsList extends Component {
	render() {
		return (
			<FlatList
				style={styles.productsContainer}
				data={this.props.products}
				keyExtractor={(product) => product._id}
				renderItem={({ item }) => {
					return (
						<Product
							name={item.product.name}
							unitPrice={item.unitPrice}
							quantity={item.quantity}
							participants={item.participants.map((participant) =>
								normalizeUserData(
									this.props.participants.find((other) => other.email === participant).profile
								)
							)}
							onPriceChange={(price) => console.log(`new price: ${price}`)}
							onQuantityChange={(quantity) => console.log(`new quantity: ${quantity}`)}
							onTitleTrigger={() => console.log('title trigged')}
							onParticipantsTrigger={() => this.props.onParticipantsTrigger(item)}
						/>
					);
				}}
			/>
		);
	}
}

CartProductsList.propTypes = {
	products: PropTypes.array.isRequired,
	participants: PropTypes.array.isRequired,
	onParticipantsTrigger: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	productsContainer: {
		flex: 1,
		alignSelf: 'stretch'
	}
});
