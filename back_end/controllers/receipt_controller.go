package controllers

import (
	"errors"
	"my-project/dto/ReceiptsDto"
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

	var cartList []dto.CheckoutItemRequest
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

	var recCounter uint = 0
	userReceiptList := make([]dto.GetUsersReceiptResponse, 0, recCounter ) //preallocate slice with size equal to the number of receipts

	for _, receipt := range receipts {

		var rowIDCounter uint = 0 
		var productDetails []dto.ReceiptsDetails	//new empty list for each product in the receipt
		
		for _, receiptProduct := range receipt.Products {
			
			rowIDCounter++
			productPhotoURL := receiptProduct.Product.ProductPhotoURL
			if productPhotoURL == "" {
				productPhotoURL = viper.GetString("default_kit_image")
			}

			productDetails = append(productDetails, dto.ReceiptsDetails{
				RowID:              rowIDCounter,
				ProductName:        receiptProduct.Product.ProductName,
				AmountInCart:       receiptProduct.AmountInCart,
				ProductPricePerUnit:receiptProduct.ProductPrice,
				SumPrice:           ( float64(receiptProduct.AmountInCart)*receiptProduct.ProductPrice ),
				ProductPhotoURL:    productPhotoURL,
			})
		
		}
		recCounter++
		userReceiptList = append(userReceiptList,  dto.GetUsersReceiptResponse{
			ReceiptID:    	recCounter,
			SumPrice:     	receipt.SumPrice,
			ProductDetails: productDetails,
		})
		
	}

	ctx.JSON(http.StatusOK, gin.H{"receipts": userReceiptList})	//returns for each receipt the list of products and their amount in that receipt
}