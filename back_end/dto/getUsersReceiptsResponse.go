package dto

type ReceiptsDetails struct {
	RowID              uint    `json:"RowID"`
	ProductName        string  `json:"ProductName"`
	AmountInCart       uint    `json:"AmountInCart"`
	ProductPricePerUnit float64 `json:"ProductPricePerUnit"`
	SumPrice           float64 `json:"SumPrice"`
	ProductPhotoURL    string  `json:"ProductPhotoURL"`
}

type GetUsersReceiptResponse struct {
	ReceiptID    	uint                 `json:"ReceiptID"`
	SumPrice      	float64              `json:"SumPrice"`
	ProductDetails 	[]ReceiptsDetails  `json:"ProductDetails"`
}