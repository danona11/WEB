export default interface ReceiptProductData{
    ReceiptID: number
    UserID: number
    ProductID: number

    ProductName: string  
    ProductSumPrice: number
    ProductAmountInCart: number
    ProductPricePerUnit: number
    ProductPhotoUrl: string
}