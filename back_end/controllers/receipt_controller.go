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
	ProductID     uint `json:"product_id"`
	ProductAmount uint `json:"product_amount"`
}

func CreateReceipt(ctx *gin.Context) {

	userInfo, exists := ctx.Get("user")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "user not authorized"})
		return
	}

	CartUser := userInfo.(modules.User)

	var cartList []CartProduct

	errBind := ctx.Bind(&cartList)
	if errBind != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid cart"})
		return
	}

	errTrans := initializers.DB_ptr.Transaction(func(tx *gorm.DB) error {

		newRec := modules.Receipt{UserID: CartUser.UserID, SumPrice: 0}

		errCreate := tx.Create(&newRec).Error
		if errCreate != nil {
			return errCreate
		}

		var recSumPrice float64 = 0

		for _, cartItem := range cartList {

			var prod modules.Product

			errFirst := tx.First(&prod, cartItem.ProductID).Error
			if errFirst != nil {
				return errors.New("product not found in the DB")
			}

			if cartItem.ProductAmount > prod.ProductStock {
				return errors.New("product does not have enough stock for the amount you want")
			}

			prod.ProductStock -= cartItem.ProductAmount
			errSave := tx.Save(&prod).Error
			if errSave != nil {
				return errSave
			}

			// Added missing commas at the end of each line
			newRecItem := modules.ReceiptProductsList{
				ReceiptID:     newRec.ReceiptID,
				ProductID:     prod.ProductID,
				ProductAmount: cartItem.ProductAmount,
				ProductPrice:  prod.ProductPrice,
			}

			result := tx.Create(&newRecItem).Error
			if result != nil {
				return result
			}

			recSumPrice += newRecItem.ProductPrice * float64(cartItem.ProductAmount)

		}

		newRec.SumPrice = recSumPrice
		errSave := tx.Save(&newRec).Error
		if errSave != nil {
			return errSave
		}

		return nil

	})

	// Checked errTrans instead of the undeclared 'err', and passed the exact error message to React
	if errTrans != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": errTrans.Error()})
		return
	}

	// Fixed typo: StatusOK
	ctx.JSON(http.StatusOK, gin.H{"message": "receipt created succesfully in the DB"})

}
