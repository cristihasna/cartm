import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import { Login, Register } from '../screens';

const LoginNavigator = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    Register
});

export default createAppContainer(LoginNavigator)
