import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../style/colors';
import { HorizontalSeparator, UserList } from '../components';
import { API_BASE_URL } from 'react-native-dotenv';
import firebase from 'react-native-firebase';

export default class SessionParticipantsManagerModal extends Component {
	constructor(props) {
		super(props);
		this.state = { visible: false, results: [], query: '' };
	}

	show() {
		this.setState({ visible: true });
	}

	hide() {
		this.setState({ visible: false });
	}

	componentWillReceiveProps(nextProps) {
		const results = this.filterParticipants(this.state.results, nextProps.participants);
		this.setState({ results });
	}

	filterParticipants(participants, others) {
		return participants.filter((participant) => {
			const other = (others ? others : this.props.participants).find(
				(other) => other.email === participant.email
			);
			return !other;
		});
	}

	async _handleInputChange(query) {
		this.setState({ query });
		const url = `${API_BASE_URL}/users?q=${encodeURIComponent(query)}`;
		const user = firebase.auth().currentUser;
		const IDToken = await user.getIdToken();
		fetch(url, {
			headers: {
				Authorization: `Bearer ${IDToken}`
			}
		})
			.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
			.then((res) => {
				if (res.status === 200) {
					const results = this.filterParticipants(res.body);
					this.setState({ results });
				}
			})
			.catch((e) => {
				console.warn(e);
			});
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
					<View style={styles.searchInputContainer}>
						<TouchableOpacity>
							<Icon name="search" style={styles.searchIcon} />
						</TouchableOpacity>
						<TextInput
							value={this.state.query}
							placeHolder={'Search for users...'}
							placeholderTextColor={colors.purple}
							style={styles.searchInput}
							onChangeText={this._handleInputChange.bind(this)}
						/>
					</View>
					<UserList
						participants={this.state.results}
						onItemPress={(participant) => this.props.onAdd(participant)}
						keyExtractor={(participant) => participant.email}
						containerStyle={{}}
					/>
					<HorizontalSeparator
						lineColor={colors.purple}
						textColor={colors.darkPurple}
						bgColor={colors.lightGrey}
					/>
					<UserList
						participants={this.props.participants}
						isApplicable={(participant) => !participant.isHost}
						iconName={'times'}
						onAction={(participant) => this.props.onRemove(participant)}
						keyExtractor={(participant) => participant._id}
					/>
				</View>
			</Modal>
		);
	}
}

SessionParticipantsManagerModal.propTypes = {
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
	},
	searchInputContainer: {
		backgroundColor: colors.white,
		display: 'flex',
		flexDirection: 'row',
		padding: 5,
		marginBottom: 10
	},
	searchIcon: {
		fontSize: 24,
		color: colors.purple
	},
	searchInput: {
		flex: 1,
		padding: 0,
		margin: 0,
		marginLeft: 10,
		fontSize: 24,
		color: colors.purple
	}
});
