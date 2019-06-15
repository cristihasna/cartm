import UUID from 'react-native-uuid';
import levenshtein from 'fast-levenshtein';

export default class TextBlocks {
	constructor() {
		this.products = [];

		/* this regex will match the following formats:
		7 DAYS MNI CROISANTS 185 GR 1 BUC X 5.20
		1 BUC X 6.25 6.25
	
		from which we will obtain the following object structure:
		{
			0: "1 BUC X 15.00"	--the entire quantity and price section
			1: "1"				--the quantity which may be float or integer
			2: " BUC"			--quantity label (may be empty)
			3: "15.00"			--price which may contain commas instead of periods
			groups: undefined
			index: 24			--starting position of quantity and price section in the input
								  this is particulary useful for determining the name of the product
			}

		*/
		this.quantityAndPrice = /([0-9]+|[0-9.,]+)(\s*[a-zA-Z]+)?\s*[x]\s*([0-9.,]+)/i;
		this.productName = /^[a-z]+/i;
	}

	getMostSimilarProductIndex(other) {
		// find the most similar product that already exists
		let index = -1;
		let minSimilarity = other.product.name.length;
		this.products.forEach((product, i) => {
			// if this product has a name of greater length, return
			// it's more likely to miss a few letters in a product's name than to find garbish letters

			// get the similarity using the fast levenshtein algorithm
			const similarity = levenshtein.get(product.product.name, other.product.name);
			if (similarity < minSimilarity) {
				minSimilarity = similarity;
				index = i;
			}
		});
		if (index === -1) return -1;
		const product = this.products[index];
		if (minSimilarity === 0) return -2;
		// object a is replaced with new object b if:
		// similarity betweet name of a and name of b is minimal
		// name of b has at least the same length as name of a
		// quantity of b is equal with quantity of b
		// price difference is less than 1 (may have missed a digit of the price)
		if (product.quantity === other.quantity && Math.abs(product.unitPrice - other.unitPrice) < 1)
			return product.product.name.length <= other.product.name.length ? index : -2;
		return -1;
	}

	addProduct(name, pQuantity, pUnitPrice) {
		// replace commas (which appear in Romanina number formats) with periods
		let quantity = pQuantity.replace(',', '.');
		let unitPrice = pUnitPrice.replace(',', '.');

		// if the regex matched a false positive and the quantity or price strings are empty, skip the product
		if (!quantity || !unitPrice) return;

		/*  check if the quantity is a fractional number, in which case 
			we will store the quantity as 1 and the unitPrice as quantity * unitPrice 
			THIS IS NOT IDEAL
        */
		if (+quantity % 1 !== 0) {
			unitPrice = +quantity * +unitPrice;
			quantity = 1;
		} else {
			quantity = +quantity;
			unitPrice = +unitPrice;
		}
		const newProduct = {
			_id: UUID.v1(),
			product: {
				barcode: null,
				name: name
			},
			participants: [],
			quantity,
			unitPrice
		};

		// get the most similar product, which will be replaced by the new product
		const indexOfSimilarProduct = this.getMostSimilarProductIndex(newProduct);
		// if no similar product exists, add the new one
		if (indexOfSimilarProduct === -1) this.products.push(newProduct);
		else if (indexOfSimilarProduct >= 0) this.products[indexOfSimilarProduct] = newProduct;
	}

	areOnSameLine(boundsA, boundsB) {
		// start and end coordinates
		let yStartA = boundsA.origin.y,
			xStartA = boundsA.origin.x,
			yEndA = boundsA.origin.y + boundsA.size.height,
			xEndA = boundsA.origin.x + boundsA.size.width,
			yStartB = boundsB.origin.y,
			xStartB = boundsB.origin.x,
			yEndB = boundsB.origin.y + boundsB.size.height,
			xEndB = boundsB.origin.x + boundsB.size.width;

		// if A and B are overlaping horizontally they're not on the same line
		if (xEndA >= xStartB && xEndB >= xStartA) return false;

		// if A and B are overlapping vertically, they're on same line
		if (yStartA < yEndB && yEndB < yEndA) return true;
		if (yStartB < yEndA && yEndA < yEndB) return true;
		return false;
	}

	processLines(lines) {
		const initialLength = this.products.length;
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].quantityAndPrice && lines[i].quantityAndPrice.index !== 0) {
				// this line contains a quantity and a price and a product name (index =/= 0)
				const quantity = lines[i].quantityAndPrice[1];
				const price = lines[i].quantityAndPrice[3];
				const indexOf = lines[i].quantityAndPrice.index;

				// get the product name which is the value before the quantity
				const productName = lines[i].value.slice(0, indexOf - 1) || 'Product';
				this.addProduct(productName, quantity, price);
			} else if (
				i < lines.length - 1 &&
				lines[i + 1].quantityAndPrice &&
				lines[i + 1].quantityAndPrice.index === 0
			) {
				// current lines does not contain a quantity and price section, but the next one does
				// therefore this entire line represents the product name
				// and the next one represents the quantity and price
				const productName = lines[i].value;
				const quantity = lines[i + 1].quantityAndPrice[1];
				const price = lines[i + 1].quantityAndPrice[3];

				this.addProduct(productName, quantity, price);
				// skip the next line as it represents the quantity and price for the current line
				i++;
			}
		}
		return this.products.length - initialLength;
	}

	nextBatch(event) {
		let lines = [];
		let blocks = event.textBlocks;
		blocks.forEach((block) => {
			// extract text lines from every block and put them in the lines array
			// which we will sort based on their coordinates
			block.components.forEach((line) =>
				lines.push(Object.assign(line, { quantityAndPrice: this.quantityAndPrice.exec(line.value) }))
			);
		});
		lines = lines
			.sort((a, b) => {
				// if the lines overlap, then they represent the same line but different blocks
				// in which case sort them by their x coordinate
				// we make sure that the quantity and price line comes after the product name, if they're not on the same line
				if (this.areOnSameLine(a.bounds, b.bounds)) {
					return a.bounds.origin.x - b.bounds.origin.x;
				} else return a.bounds.origin.y - b.bounds.origin.y;
			})
			// remove lines that start with a number and are not a quantity and price section
			// this is common for receipts that have a total price on the right side
			.filter((line) => line.quantityAndPrice || this.productName.exec(line.value));
		return this.processLines(lines);
	}

	getProducts() {
		return this.products;
	}
}
