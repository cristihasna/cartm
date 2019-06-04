import { OPEN_FOOD_FACTS_API_URL } from 'react-native-dotenv';

export default (barcode) => {
	let productData = {};
	return fetch(`${OPEN_FOOD_FACTS_API_URL}/${barcode}.json`)
		.then((data) => data.json())
		.then((data) => {
			if (data.status === 0) return null;
			if (data.product.product_name) productData.name = data.product.product_name;
			if (data.product.nova_groups) productData.nova_group = data.product.nova_group;
			if (data.product.nutrition_grades) productData.nutrition_grade = data.product.nutrition_grades;
			if (data.product.nutrient_levels) productData.nutrient_levels = data.product.nutrient_levels;
			if (data.product.allergens) productData.allergens = data.product.allergens;
            if (data.product.quantity) productData.quantity = data.product.quantity;
            if (data.product.image_url) productData.image_url = data.product.image_url;

			return productData;
		})
		.catch((err) => {
			return null;
		});
};
