export const CartTexts = {
	
	pageHeader: "MY CART",
	clearButton: "CLEAR CART",
	emptyMessage: "your cart is currently empty - go to products page to add items to cart",
	checkoutTotal: "CHECKOUT TOTAL:",
	checkoutButton: "CHECKOUT",
	stockLeft: "stock left:",
	total: "total:",
	amount: "amount:",
	deleteButton: "DELETE",
	deleteText: "remove item from cart",
	currency: "ILS",
}

export const CartMsg = {
	
	empty: "cart empty",
	itemRemoved: "item removed from cart",
	checkoutSuccess: "checkout successfull, enjoy your new kits",
	checkoutError: "error checking-out",
}

export const CartDialog = {
	
	removeItem: {
		title: "remove item from cart",
		description: (name?: string) => `sure u want to delete ${name} from your cart?`,
		confirmText: "delete",
	},
	
	clearCart: {
		title: "clear cart",
		description: "sure u want to clear all the items from your cart?",
		confirmText: "clear",
	},
	
	checkout: {
		title: "checkout",
		description: "sure u want to proceed to checkout cart?",
		confirmText: "checkout",
	}
}

export const OutOfStockColor = "#ffcccc"
export const OutOfStockOpacity = 0.7
export const InStockOpacity = 1


export const GetCartKey = (userName: string) => `${userName}'s_cart`