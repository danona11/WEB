package controllers

import (
	"errors"
	"my-project/initializers"
	"my-project/modules"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CartProduct struct {
	ProductID   	uint
	AmountInCart	uint
}

func CreateReceipt(ctx *gin.Context) {

	userInfo, exists := ctx.Get("user")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
		return
	}
	var user modules.User = userInfo.(modules.User)

	var cartList []CartProduct
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

				newRecItem := modules.ReceiptProductsList{
					ReceiptID:     newRec.ReceiptID,
					ProductID:     prod.ProductID,
					AmountInCart: cartItem.AmountInCart,
					ProductPrice:  prod.ProductPrice,
				}

				result := trCtx.Create(&newRecItem).Error
				if result != nil {
					return result
				}

				recSumPrice += newRecItem.ProductPrice * float64(cartItem.AmountInCart)

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
