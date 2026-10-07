package controllers

import (
	"my-project/initializers"
	"my-project/modules"
	"net/http"
	"github.com/gin-gonic/gin"
)

func CreateProduct(ctx *gin.Context) {

	var productInfo modules.Product

	ctx.Bind(&productInfo)

	prod := modules.Product{ProductName: productInfo.ProductName,
		ProductStock: productInfo.ProductStock,
		ProductPrice: productInfo.ProductPrice}

	result := initializers.DB_ptr.Create(&prod)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to create products"})
		return
	}

}

// show all the posts:
func ProductIndex(ctx *gin.Context) {
	var prodsList []modules.Product

	result := initializers.DB_ptr.Find(&prodsList)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to fetch product"})
		return
	}

	ctx.JSON(200, gin.H{"Product": prodsList})

}

// for showing a singular product from search:
func ShowProduct(ctx *gin.Context) {
	//getting the products id off the URL:
	prod_id := ctx.Param("id")

	var prod modules.Product

	//will show the first product that meets the search conditions:
	result := initializers.DB_ptr.First(&prod, prod_id)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to fetch products"})
		return
	}

	ctx.JSON(200, gin.H{"Product": prod})
}


func UpdateProduct(ctx *gin.Context) {
	//getting the products id off the URL:
	prod_id := ctx.Param("id")

	var upd_prod modules.Product
	ctx.Bind(&upd_prod)

	var old_prod modules.Product

	//select product from where old_prod.id = prod_id:
	result := initializers.DB_ptr.First(&old_prod, prod_id)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "couldnt find product"})
		return
	}

	initializers.DB_ptr.Model(&old_prod).
		Updates(modules.Product{ProductName: upd_prod.ProductName,
			ProductStock: upd_prod.ProductStock,
			ProductPrice: upd_prod.ProductPrice,
		})

	ctx.JSON(200, gin.H{"product": old_prod})
}


func DeleteProduct(ctx *gin.Context) {
	//getting the products id off the URL:
	prod_id := ctx.Param("id")

	result := initializers.DB_ptr.Delete(&modules.Product{}, prod_id)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "couldnt find product , to delete"})
		return
	}

	ctx.JSON(200, gin.H{"message": "successfully deleted product"})
}
