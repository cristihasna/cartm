import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../style/colors';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts';

export default ({ products }) => {
	const formatDate = (productDate) => {
		let date = new Date(productDate);
		return `${date.getDate()}/${date.getMonth() + 1}`;
	};
	const compareFormatedDates = (a, b) => {
		let [ dayA, monthA ] = a.date.split('/');
		[ dayA, monthA ] = [ parseInt(dayA), parseInt(monthA) ];
		let [ dayB, monthB ] = b.date.split('/');
		[ dayB, monthB ] = [ parseInt(dayB), parseInt(monthB) ];

		if (monthA > monthB) return 1;
		if (monthA < monthB) return -1;
		return dayA < dayB ? -1 : dayA > dayB ? 1 : 0;
	};

	let data = {};
	if (products)
		products.forEach((product) => {
			const cost = product.unitPrice * product.quantity / product.participants.length;
			const formatedDate = formatDate(product.date);
			if (data.hasOwnProperty(formatedDate)) data[formatedDate] += cost;
			else data[formatedDate] = cost;
		});
	let graphData = [];
	for (key in data) graphData.push({ amount: data[key], date: key });
	graphData.sort(compareFormatedDates);
	if (graphData.length > 6) graphData = graphData.slice(graphData.length - 6);

	const axesSvg = { fontSize: 12, fill: colors.purple };
	return (
		<View style={styles.graph}>
			<YAxis
				data={graphData.map((data) => data.amount)}
				style={{ paddingRight: 5, width: 25 }}
				contentInset={{ top: 10, bottom: 10 }}
				svg={axesSvg}
				numberOfTicks={5}
			/>
			<View style={{ flex: 1 }}>
				<LineChart
					style={{ flex: 1 }}
					data={graphData.map((data) => data.amount)}
					contentInset={{ top: 10, bottom: 10 }}
					numberOfTicks={5}
					svg={{ stroke: colors.purple }}>
					<Grid svg={{ fill: colors.darkGrey }} />
				</LineChart>
				<XAxis
					style={{ width: 100 + '%', height: 50, marginBottom: -50 }}
					data={graphData.map((data) => data.amount)}
					formatLabel={(_, i) => graphData[i].date}
					contentInset={{ left: 15, right: 15 }}
					svg={{ rotation: 0, ...axesSvg }}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	graph: {
		height: 100,
		padding: 0,
		flexDirection: 'row'
	}
});
