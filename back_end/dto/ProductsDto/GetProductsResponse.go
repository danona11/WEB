package dto

type GetProductsResponse struct{
	ProductName     string	`json:"ProductName"`
	ProductID 		uint 	`json:"ProductID"`
	ProductTeam     string  `json:"ProductTeam"`
    ProductDesign   string  `json:"ProductDesign"`
    ProductYear     int     `json:"ProductYear"`	
	ProductPrice 	float64 `json:"ProductPrice"`
	ProductStock 	uint 	`json:"ProductStock"`
	ProductPhotoURL string 	`json:"ProductPhotoURL"`
}

type GetProductsPaginationResponse struct{

	Products 	[]GetProductsResponse 	`json:"Products"`
	MaxPage 			int				`json:"MaxPage"`
	ProductsPerPage 	int 			`json:"ProductsPerPage"`
}