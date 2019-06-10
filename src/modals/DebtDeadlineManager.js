import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { User } from '../components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import colors from '../style/colors';
import DatePicker from 'react-native-datepicker';

const DatePickerButton = ({ iconName, onAction, disabled, style }) => (
	<TouchableOpacity onPress={onAction} disabled={disabled} style={[ styles.datePickerButton, style ]}>
		<Icon
			name={iconName}
			style={[ styles.datePickerButtonIcon, ...[ disabled ? styles.datePickerButtonIconDisabled : null ] ]}
		/>
	</TouchableOpacity>
);

const Product = ({ product }) => {
	const description = `(${product.unitPrice.toFixed(2)} / ${product.participants.length} participants)`;
	let name = product.product.name;
	if (name.length > 30) name = name.slice(0, 25) + '...' + name.slice(name.length - 3);
	return (
		<View style={styles.productContainer}>
			<View style={styles.productTop}>
				<Text style={styles.productName}>{name}</Text>
				<Text style={styles.productPrice}>{(product.unitPrice / product.participants.length).toFixed(2)}</Text>
			</View>
			<View style={styles.productRight}>
				{product.participants.length > 1 && <Text style={styles.productDesc}>{description}</Text>}
			</View>
		</View>
	);
};

export default class DebtDeadlineManager extends Component {
	constructor(props) {
		super(props);
		this.state = { visible: false, debt: null, date: null };
	}

	show(debt) {
		this.setState({ visible: true, debt, date: debt.deadline });
	}

	hide() {
		this.setState({ visible: false, debt: null, date: null });
	}

	render() {
		let products = [];
		let timeline;
		if (this.state.debt) {
			products = this.state.debt.session.products.filter((product) =>
				product.participants.includes(this.state.debt.owedBy.email)
			);
			const date = new Date(this.state.debt.session.endDate);
			const now = new Date();
			const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			const month = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ][
				date.getMonth()
			];
			const year = date.getFullYear();
			timeline = `${day} - ${month} - ${year}`;
			if (now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth()) {
				if (now.getDate() === date.getDate()) timeline = 'today';
				else if (now.getDate() - date.getDate() === 1) timeline = 'yesterday';
			}
		}
		let modalContent = this.state.debt ? (
			<View style={styles.contentWrapper}>
				<User containerStyle={styles.user} data={this.state.debt.owedBy} />
				<Text style={styles.label}>owes you</Text>
				<Text style={styles.amount}>{this.state.debt.amount.toFixed(2)}</Text>
				<Text style={[ styles.label, { marginTop: 0 } ]}>{'from ' + timeline}</Text>
				<View style={styles.deadlineContainer}>
					<Icon name="user-clock" style={styles.deadlineIcon} />
					<DatePicker
						style={styles.datePicker}
						customStyles={{
							dateInput: styles.datePickerInput,
							dateText: styles.datePickerText,
							placeholderText: styles.datePickerPH
						}}
						date={this.state.date}
						mode="date"
						placeholder="no deadline set"
						format="YYYY-MM-DD"
						minDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)} // date of tomorrow
						confirmBtnText="Confirm"
						cancelBtnText="Cancel"
						onDateChange={(date) => {
							this.setState({ date: date });
						}}
						androidMode="spinner"
						showIcon={false}
					/>
					<DatePickerButton
						iconName="check"
						onAction={() => this.props.onSetDeadline(this.state.debt, this.state.date)}
						disabled={this.state.date === this.state.debt.deadline}
					/>
					<DatePickerButton
						iconName="times"
						onAction={() => this.setState({ date: null })}
						disabled={!this.state.date}
					/>
				</View>
				<Text style={[ styles.label, { marginTop: 50, fontStyle: 'italic' } ]}>for the following products</Text>
				<ScrollView style={styles.productsContainer}>
					{products.map((product) => <Product key={product._id} product={product} />)}
				</ScrollView>
			</View>
		) : null;
		return (
			<Modal
				style={styles.modal}
				visible={this.state.visible}
				animationType={'fade'}
				transparent={true}
				onRequestClose={this.hide.bind(this)}>
				<TouchableOpacity activeOpacity={0.7} style={styles.background} onPress={this.hide.bind(this)} />
				<View style={styles.container}>{modalContent}</View>
			</Modal>
		);
	}
}

DebtDeadlineManager.propTypes = {
	onSetDeadline: PropTypes.func.isRequired
	// onRemove: PropTypes.func.isRequired
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
	},
	contentWrapper: {
		alignItems: 'center'
	},
	user: {
		flex: 0,
		marginLeft: -52
	},
	label: {
		marginTop: -10,
		color: colors.purple,
		fontSize: 16
	},
	amount: {
		fontSize: 38,
		color: colors.purple,
		fontWeight: 'bold'
	},
	deadlineContainer: {
		marginTop: 20,
		paddingHorizontal: 10,
		backgroundColor: colors.white,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	deadlineIcon: {
		marginRight: 10,
		fontSize: 24,
		color: colors.purple
	},
	datePicker: {
		flex: 1
	},
	datePickerInput: {
		borderWidth: 0
	},
	datePickerText: {
		paddingHorizontal: 20,
		fontSize: 18,
		fontWeight: 'bold',
		letterSpacing: 1,
		color: colors.purple
	},
	datePickerPH: {
		paddingHorizontal: 20,
		fontSize: 18,
		fontStyle: 'italic',
		color: colors.purple
	},
	datePickerButton: {
		width: 42,
		height: 42,
		justifyContent: 'center',
		alignItems: 'center'
	},
	datePickerButtonIconDisabled: {
		color: colors.lightPurple
	},
	datePickerButtonIcon: {
		fontSize: 22,
		color: colors.purple
	},
	productsContainer: {
		width: 100 + '%',
		marginTop: 20
	},
	productContainer: {
		marginVertical: 5
	},
	productTop: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	productName: {
		color: colors.purple,
		fontSize: 20
	},
	productPrice: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.purple
	},
	productRight: {
		alignItems: 'flex-end'
	},
	productDesc: {
		fontSize: 14,
		color: colors.purple,
		fontStyle: 'italic',
		marginTop: -5
	}
});
