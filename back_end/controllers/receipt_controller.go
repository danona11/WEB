package controllers

import (
	"errors"
	"my-project/dto"
	"my-project/initializers"
	"my-project/modules"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"gorm.io/gorm"
)

func CreateReceipt(ctx *gin.Context) {

	userInfo, exists := ctx.Get("user")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
		return
	}
	var user modules.User = userInfo.(modules.User)

	var cartList []modules.CreateReceiptItemStruct
	errBind := ctx.Bind(&cartList)
	if errBind != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid cart"})
		return
	}

//an sql transaction that checks the stock after the order - return err will fallback , otherwise commit
	errTransaction := initializers.DB_ptr.Transaction( 
		func(trCtx *gorm.DB) error {	
			
			var recSumPrice float64 = 0

			newRec := modules.Receipt{
				UserID: user.UserID, 
				SumPrice: recSumPrice,
			}

			if errCreate := trCtx.Create(&newRec).Error; errCreate != nil {
				return errCreate													//rollback
			}

			for _, cartItem := range cartList {

				var prod modules.Product

				errFirst := trCtx.First(&prod, cartItem.ProductID).Error
				if errFirst != nil {
					return errors.New("product not found in the DB")				//roolback
				}

				if cartItem.AmountInCart > prod.ProductStock {
					return errors.New("product stock lower than amount bought")		//rollback
				}

				prod.ProductStock -= cartItem.AmountInCart
				errSave := trCtx.Save(&prod).Error
				if errSave != nil {	
					return errSave													//rollback
				}

				newRecProd := modules.ReceiptProducts{
					ReceiptID:     newRec.ReceiptID,
					ProductID:     prod.ProductID,
					AmountInCart: cartItem.AmountInCart,
					ProductPrice:  prod.ProductPrice,
				}

				result := trCtx.Create(&newRecProd).Error
				if result != nil {
					return result
				}

				recSumPrice += newRecProd.ProductPrice * float64(cartItem.AmountInCart)

			}

			newRec.SumPrice = recSumPrice
			errSave := trCtx.Save(&newRec).Error
			if errSave != nil {
				return errSave
			}

			return nil	//everything is fine - commit
		},
	)
	if errTransaction != nil{
		ctx.JSON(http.StatusBadRequest, gin.H{"error": errTransaction.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "receipt created succesfully in the DB"})
}


func GetUsersReceipts(ctx *gin.Context) {

	userInfo, exists := ctx.Get("user")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
		return
	}

	var user modules.User = userInfo.(modules.User)

	var receipts []modules.Receipt

//gorm automatically queries the receipts, grabs their line items, and fetches the product details for each item in one clean operation.
	err := initializers.DB_ptr.
        Where("user_id = ?", user.UserID).
        	Preload("Products").			//single use table join - fetches the line items for each receipt
        		Preload("Products.Product").
        Find(&receipts).Error
	
	if err != nil {	
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to fetch receipts"})
		return
	}

	var usersReceiptResponses = [] dto.GetUsersReceiptResponse{}
	var rowIDCounter uint = 0 

	for _, receipt := range receipts {	//iterate through each receipt and create a response object for each one
		for _, receiptProduct := range receipt.Products {	//iterate through each line product in the receipt
			var row dto.GetUsersReceiptResponse
			rowIDCounter++
			
			row.RowID = rowIDCounter
			row.ReceiptID = receipt.ReceiptID
			row.SumPrice = receipt.SumPrice
			row.ProductName = receiptProduct.Product.ProductName
			row.AmountInCart = receiptProduct.AmountInCart
			row.ProductPrice = receiptProduct.ProductPrice
			
			if receiptProduct.Product.ProductPhotoUrl == "" {
				receiptProduct.Product.ProductPhotoUrl = viper.GetString("default_kit_image")
			}
			row.ProductPhotoURL = receiptProduct.Product.ProductPhotoUrl
			
			usersReceiptResponses = append(usersReceiptResponses, row)

		}
	}

	ctx.JSON(http.StatusOK, gin.H{"receipts": usersReceiptResponses})	//returns for each receipt the list of products and their amount in that receipt
}