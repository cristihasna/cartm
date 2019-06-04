import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { UserList } from '../components';
import PropTypes from 'prop-types';
import colors from '../style/colors';

export default class ProductParticipantsManager extends Component {
	constructor(props) {
		super(props);
		this.state = { visible: false, product: { participants: [] } };
	}

	show(product) {
		this.setState({ visible: true, product });
	}

	isApplicable(participant) {
		const other = this.state.product.participants.find((otherEmail) => otherEmail === participant.email);
		return !!other;
	}

	toggleParticipant(participant) {
		if (this.isApplicable(participant)) {
            let newParticipants = this.state.product.participants;
            const index = newParticipants.findIndex((email) => email === participant.email);
            newParticipants = newParticipants.slice(0, index).concat(newParticipants.slice(index + 1));
			this.setState({ product: Object.assign(this.state.product, { participants: newParticipants }) });
            this.props.onRemove(this.state.product, participant);
		} else {
            let newParticipants = this.state.product.participants;
            newParticipants.push(participant.email);
            this.props.onAdd(this.state.product, participant);
			this.setState({ product: Object.assign(this.state.product, { participants: newParticipants }) });
            
        }
	}

	hide() {
		this.setState({ visible: false, product: { participants: [] } });
	}

	render() {
		return (
			<Modal
				style={styles.modal}
				visible={this.state.visible}
				animationType={'fade'}
				transparent={true}
				onRequestClose={this.hide.bind(this)}>
				<TouchableOpacity activeOpacity={0.7} style={styles.background} onPress={this.hide.bind(this)} />
				<View style={styles.container}>
					<UserList
						participants={this.props.participants}
						isApplicable={this.isApplicable.bind(this)}
						iconName={'check'}
						onAction={this.toggleParticipant.bind(this)}
						onItemPress={this.toggleParticipant.bind(this)}
						keyExtractor={(participant) => participant._id}
					/>
				</View>
			</Modal>
		);
	}
}

ProductParticipantsManager.propTypes = {
	onAdd: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	participants: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
	modal: {
		display: 'flex',
		width: 100 + '%',
		height: 100 + '%',
		backgroundColor: 'transparent'
	},
	background: {
		position: 'absolute',
		flex: 1,
		top: 0,
		left: 0,
		width: 100 + '%',
		height: 100 + '%',
		backgroundColor: colors.darkPurple,
		opacity: 0.7
	},
	container: {
		margin: 20,
		padding: 20,
		maxHeight: Dimensions.get('window').height - 80,
		backgroundColor: colors.lightGrey
	}
});
