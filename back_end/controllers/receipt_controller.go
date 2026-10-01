package controllers

import(
	"errors"
	"my-project/initializers"
	"my-project/modules"
	"github.com/gin-gonic/gin"
)

func CreateReceipt(ctx *gin.Context){

	var recInfo struct{
		Product_id uint
		Product_amount int
	}

	userInfo, exsists := ctx.GET("user")


}