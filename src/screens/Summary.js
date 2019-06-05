import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenHeading } from '../components';
import { connect } from 'react-redux';
import colors from '../style/colors';
class Summary extends Component {
	render() {
        const total = this.props.session.products.reduce((total, product) => {
            const cost = product.unitPrice * product.quantity;
            return total + cost;
        }, 0);
		return (
			<View style={styles.container}>
				<ScreenHeading title={'Back to cart'} action={() => this.props.navigation.goBack()}/>
				<View style={styles.contentWrapper}>
                    <View style={styles.totalCostContainer}>
                        <Text style={styles.label}>Total: </Text>
                        <Text style={[styles.accent, {fontSize: 28}]}>{total}</Text>
                    </View>
                </View>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	loading: state.loading,
	session: state.session,
	login: state.login
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: 100 + '%',
		height: 100 + '%',
		backgroundColor: colors.lightGrey
    },
    contentWrapper: {
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    totalCostContainer: {
        marginTop: 10,
        display: 'flex',
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

export default connect(mapStateToProps)(Summary);
