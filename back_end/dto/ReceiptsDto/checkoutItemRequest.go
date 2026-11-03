package dto

type CheckoutItemRequest struct {
	
	ProductID    uint `json:"ProductID"`
	AmountInCart uint `json:"AmountInCart"`
}