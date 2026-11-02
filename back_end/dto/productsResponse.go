package dto
type ProductsResponse struct {
	ProductID 		uint 	`json:"product_id"`
	ProductName 	string 	`json:"product_name"`
	ProductStock 	uint 	`json:"product_stock"`
	ProductPrice 	float64 `json:"product_price"`
	ProductPhotoUrl string 	`json:"product_photo_url"`
}