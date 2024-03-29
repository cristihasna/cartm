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
				refreshControl={this.props.refreshControl}
				keyExtractor={(product) => product._id}
				renderItem={({ item }) => {
					return (
						<Product
							product={item}
							onRemove={this.props.onRemoveProduct}
							participants={this.props.participants}
							onParticipantsTrigger={() => this.props.onParticipantsTrigger(item)}
							onPatch={this.props.onPatchProduct}
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
	onRemoveProduct: PropTypes.func.isRequired,
	onPatchProduct: PropTypes.func.isRequired,
	refreshControl: PropTypes.element.isRequired
};

const styles = StyleSheet.create({
	productsContainer: {
		flex: 1,
		alignSelf: 'stretch'
	}
});
