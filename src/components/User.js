import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import colors from '../style/colors';

export default ({ onPress, data, containerStyle, iconStyle, textStyle }) => {
	const UserContainer = onPress ? TouchableOpacity : View;
	return (
		<UserContainer onPress={onPress} style={[ styles.container, containerStyle ]}>
			<View style={[ styles.profileImgContainer, iconStyle ]}>
				{data.photoURL ? (
					<Image style={styles.profileImg} source={{ uri: data.photoURL }} />
				) : (
					<Text style={styles.profileImgReplacement}>{data.profileImgReplacement}</Text>
				)}
			</View>
			<Text style={[ styles.displayName, textStyle ]}>{data.displayName}</Text>
		</UserContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	profileImgContainer: {
		width: 42,
		height: 42,
		borderRadius: 42,
		borderWidth: 3,
		borderColor: colors.lightPurple,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.white
	},
	profileImg: {
		flex: 1,
		width: 100 + '%',
		height: 100 + '%',
		borderRadius: 35
	},
	profileImgReplacement: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.purple
	},
	displayName: {
		fontSize: 24,
		marginLeft: 10,
		color: colors.purple
	}
});
