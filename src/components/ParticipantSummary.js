import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import User from './User';
import ParticipantsList from './ParticipantsList';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../style/colors';

export default (participant, collapsed) => {
	const height = collapsed ? 'auto' : 0;
	const opacity = collapsed ? 1 : 0;
	return (
		<TouchableOpacity
			activeOpacity={0.75}
			style={styles.participantContainer}
			onPress={() => this.props.onToggle(participant._id)}>
			<User data={participant.profile} />
			<View style={styles.hasBorderLeft}>
				<View style={styles.dropdownContainer}>
					<View style={styles.dropdownSection}>
						<Icon
							style={styles.dropdownIcon}
							name={collapsed ? 'chevron-down' : 'chevron-right'}
						/>
						<Text style={[ styles.accent, { color: colors.darkPurple, fontSize: 20 } ]}>
							{participant.products.length}
						</Text>
						<Text style={[ styles.label, { fontSize: 20, marginLeft: 5 } ]}>
							{participant.products.length === 1 ? 'product' : 'products'}
						</Text>
					</View>
					<View style={[ styles.hasBorderLeft, { marginLeft: 10, opacity, height } ]}>
						{participant.products.map((product) => (
							<View style={styles.participantProductContainer} key={product._id}>
								<Text style={styles.participantProductName}>
									{product.product.name.length <= 25 ? (
										product.product.name
									) : (
										product.product.name.substr(0, 22) + '...'
									)}
								</Text>
								<View style={styles.participantProductInfo}>
									<Text style={[ styles.accent, { fontSize: 18, marginRight: 10 } ]}>+</Text>
									<ParticipantsList
										containerStyle={{ width: 'auto' }}
										itemStyle={{ borderColor: colors.lightGrey }}
										participants={product.coParticipants.filter(
											(p) => p.email !== participant.email
										)}
									/>
								</View>
							</View>
						))}
					</View>
					<View style={styles.dropdownSection}>
						<Text style={[ styles.label, { fontSize: 20 } ]}>total:</Text>
						<Text style={[ styles.accent, { fontSize: 20, marginLeft: 10 } ]}>
							{participant.debt.toFixed(2)}
						</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	participantContainer: {
		marginVertical: 10
	},
	hasBorderLeft: {
		paddingLeft: 15,
		marginLeft: 20,
		marginTop: 5,
		borderLeftColor: colors.purple,
		borderLeftWidth: 1
	},
	dropdownContainer: {},
	dropdownSection: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	dropdownIcon: {
		width: 20,
		textAlign: 'center',
		fontSize: 18,
		marginRight: 10,
		color: colors.purple
	},
	participantProductContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	participantProductName: {
		fontSize: 16,
		color: colors.darkPurple
	},
	participantProductInfo: {
		flex: 1,
		justifyContent: 'flex-end',
		flexDirection: 'row',
		alignItems: 'center'
	},
	label: {
		fontSize: 24,
		color: colors.darkPurple
	},
	accent: {
		fontSize: 24,
		color: colors.purple,
		fontWeight: 'bold'
	}
});
