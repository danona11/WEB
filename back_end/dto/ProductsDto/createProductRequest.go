package dto

type CreateProductRequest struct{
	ProductName     string	`json:"ProductName"`
	ProductTeam     string  `json:"ProductTeam"`
    ProductDesign   string  `json:"ProductDesign"`
    ProductYear     int     `json:"ProductYear"`	
	ProductPrice 	float64 `json:"ProductPrice"`
	ProductStock 	uint 	`json:"ProductStock"`
	ProductPhotoURL string 	`json:"ProductPhotoURL"`
}