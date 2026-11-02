package dto

type UpdateProductRequest struct {
	ProductName 	string 	`json:"ProductName"`
	ProductPrice 	float64 `json:"ProductPrice"`
	ProductStock 	uint 	`json:"ProductStock"`
	ProductPhotoURL string 	`json:"ProductPhotoURL"`
}