package dto

type GetUsersReceiptResponse struct {
	RowID    		uint 	`json:"id"`
	ReceiptID 		uint 	`json:"receipt_id"`
	SumPrice  		float64 `json:"sum_price"`
	ProductName 	string 	`json:"product_name"`
	AmountInCart 	uint 	`json:"amount_in_cart"`
	ProductPrice 	float64 `json:"product_price"`
	ProductPhotoURL string 	`json:"product_photo_url"`
}