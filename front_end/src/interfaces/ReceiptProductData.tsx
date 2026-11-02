export interface ReceiptProductDetails{
    RowID:              number
    SumPrice:           number
    ProductName:        string  
    AmountInCart:       number
    ProductPricePerUnit:number
    ProductPhotoURL:    string
}

export interface ReceiptsList{
    ReceiptID:          number
    SumPrice:           number
    ProductDetails:     ReceiptProductDetails[]
}