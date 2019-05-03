import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../style/colors';
import { connect } from 'react-redux';
import { logoutUser } from '../redux/actions/loginActions';
import { createSession } from '../redux/actions/sessionActions';
import firebase from 'react-native-firebase';

const DrawerItem = ({ label, iconName, onPress, labelStyle, iconStyle, containerStyle }) => {
	return (
		<TouchableOpacity style={[ styles.itemContainer, containerStyle ]} onPress={onPress}>
			<Icon name={iconName} style={[ styles.itemIcon, iconStyle ]} solid />
			<Text style={[ styles.itemLabel, labelStyle ]}>{label}</Text>
		</TouchableOpacity>
	);
};

class DrawerContent extends Component {
	_handleLogout() {
		logoutUser();
		firebase.auth().signOut().then(() => {
			logoutUser();
			this.props.navigation.navigate('RootNavigator');
		});
	}

	render() {
		const { navigation, login, session, createSession } = this.props;

		return (
			<ScrollView style={styles.container}>
				<View style={[ styles.profileContainer, styles.separatorAfter ]}>
					<View style={styles.profileImgContainer}>
						{login.profileImg ? (
							<Image style={styles.profileImg} source={{ uri: login.profileImg }} />
						) : (
							<Text style={styles.profileImgReplacement}>{login.profileImgReplacement}</Text>
						)}
					</View>
					<Text style={styles.displayName}>{login.displayName}</Text>
				</View>
				{session ? (
					<DrawerItem
						label={'Current session'}
						iconName={'users'}
						onPress={() => navigation.navigate('CurrentSession')}
						iconStyle={{ color: colors.purple }}
						labelStyle={{ color: colors.purple }}
						containerStyle={styles.separatorAfter}
					/>
				) : (
					<DrawerItem
						label={'Create session'}
						iconName={'shopping-cart'}
						onPress={() => createSession(navigation)}
					/>
				)}
				<DrawerItem
					label={'Split a receipt'}
					iconName={'receipt'}
					onPress={() => console.warn('navigate to split receipt')}
					containerStyle={styles.separatorAfter}
				/>
				<DrawerItem
					label={'View profile'}
					iconName={'user'}
					onPress={() => console.warn('navigate to profile')}
				/>
				<DrawerItem
					label={'Log out'}
					iconName={'sign-out-alt'}
					onPress={this._handleLogout.bind(this)}
					containerStyle={styles.separatorAfter}
				/>
				<DrawerItem label={'Settings'} iconName={'cog'} onPress={() => console.warn('sign out')} />
			</ScrollView>
		);
	}
}

const mapStateToProps = (state) => ({
	login: state.login,
	session: state.session
});

export default connect(mapStateToProps,  {createSession})(DrawerContent);

const styles = StyleSheet.create({
	separatorAfter: {
		borderBottomWidth: 1,
		paddingBottom: 30,
		marginBottom: 30,
		borderBottomColor: colors.lightPurple
	},
	container: {
		flex: 1,
		backgroundColor: colors.lightGrey
	},
	profileContainer: {
		paddingVertical: 30,
		flex: 1,
		width: 100 + '%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	profileImgContainer: {
		flex: 1,
		width: 128,
		height: 128,
		borderRadius: 128,
		borderColor: colors.lightPurple,
		backgroundColor: colors.white,
		borderWidth: 7,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center'
	},
	profileImg: {
		flex: 1,
		width: 100 + '%',
		height: 100 + '%'
	},
	profileImgReplacement: {
		fontSize: 50,
		fontWeight: 'bold',
		color: colors.purple
	},
	displayName: {
		color: colors.purple,
		fontSize: 32,
		marginTop: 10
	},
	itemContainer: {
		paddingLeft: 25,
		marginVertical: 10,
		flex: 1,
		flexDirection: 'row'
	},
	itemIcon: {
		fontSize: 24,
		width: 36,
		textAlign: 'center',
		color: colors.darkPurple
	},
	itemLabel: {
		fontSize: 24,
		fontWeight: 'bold',
		color: colors.darkPurple
	}
});
