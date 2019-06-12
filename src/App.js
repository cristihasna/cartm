import React, { Component } from 'react';
import { AsyncStorage, Alert } from 'react-native';
import { Provider } from 'react-redux';
import store from './redux/store';
import firebase, { RNFirebase } from 'react-native-firebase';

import RootNavigator from './navigators/RootNavigator';

export default class App extends Component {
	async componentDidMount() {
		this.checkPermission();
		this.createNotificationListeners();
	}

	componentWillUnmount() {
		this.notificationListener;
		this.notificationOpenedListener;
	}

	//1
	async checkPermission() {
		const enabled = await firebase.messaging().hasPermission();
		if (enabled) {
			this.getToken();
		} else {
			this.requestPermission();
		}
	}

	//3
	async getToken() {
		let fcmToken = await AsyncStorage.getItem('fcmToken');
		if (!fcmToken) {
			fcmToken = await firebase.messaging().getToken();
			if (fcmToken) {
				// user has a device token
				console.log('fcmToken:', fcmToken);
				await AsyncStorage.setItem('fcmToken', fcmToken);
			}
		}
		console.log('fcmToken:', fcmToken);
	}

	//2
	async requestPermission() {
		try {
			await firebase.messaging().requestPermission();
			// User has authorised
			this.getToken();
		} catch (error) {
			// User has rejected permissions
			console.log('permission rejected');
		}
	}

	async createNotificationListeners() {
		/*
		* Triggered when a particular notification has been received in foreground
		* */
		this.notificationListener = firebase.notifications().onNotification((notification) => {
			const { title, body } = notification;
			console.log('onNotification:');

			const localNotification = new firebase.notifications.Notification()
				.setNotificationId(notification.notificationId)
				.setTitle(title)
				.setBody(body)
				.setData({show_in_foreground: true})
				.setSound('default')
				.android.setChannelId('fcm_cartm_default_channel')
				.android.setVibrate([300, 100, 300])
			// console.log(localNotification);
			firebase.notifications().displayNotification(localNotification).then(() => console.log('displayed'));
		});

		const channel = new firebase.notifications.Android.Channel(
			'fcm_cartm_default_channel',
			'CatM',
			firebase.notifications.Android.Importance.Max
		).setDescription('CartM notification channel');
		firebase.notifications().android.createChannel(channel);

		/*
		* If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		* */
		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
			const { title, body } = notificationOpen.notification;
			console.log('onNotificationOpened:');
			Alert.alert(title, body);
		});

		/*
		* If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		* */
		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
			const { title, body } = notificationOpen.notification;
			console.log('getInitialNotification:');
			Alert.alert(title, body);
		}
		/*
		* Triggered for data only payload in foreground
		* */
		this.messageListener = firebase.messaging().onMessage((message) => {
			//process data message
			console.log('JSON.stringify:', JSON.stringify(message));
		});
	}

	render() {
		return (
			<Provider store={store}>
				<RootNavigator />
			</Provider>
		);
	}
}
