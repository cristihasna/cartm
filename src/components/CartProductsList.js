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
							product={item}
                            onRemove={this.props.onRemoveProduct}
							participants={this.props.participants}
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
    onParticipantsTrigger: PropTypes.func.isRequired,
    onRemoveProduct: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	productsContainer: {
		flex: 1,
		alignSelf: 'stretch'
	}
});
