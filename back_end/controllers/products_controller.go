package controllers

import (
	"my-project/initializers"
	"my-project/modules"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateProduct(ctx *gin.Context) {

	var info modules.Product

	ctx.Bind(&info)

	prod := modules.Product{Product_name: info.Product_name,
		Product_stock: info.Product_stock,
		Product_price: info.Product_price}

	result := initializers.DB_ptr.Create(&prod)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to register new user"})
		return
	}

}

//show all the posts:
func ProductIndex(ctx *gin.Context) {
	var prods_list [] modules.Product

	result := initializers.DB_ptr.Find(&prods_list)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to register new user"})
		return
	}

	ctx.JSON(200 , gin.H{ "Product":prods_list } )

}

//for showing a singular product from search:
func ShowProduct(ctx *gin.Context){
	//getting the products id off the URL:
	prod_id := ctx.Param("id")

	var prod modules.Product

	//will show the first product that meets the search conditions:
	result := initializers.DB_ptr.First( &prod , prod_id )
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to register new user"})
		return
	}

	ctx.JSON(200 , gin.H{ "Product":prod } )
}

func UpdateProduct(ctx *gin.Context){
//getting the products id off the URL:
	prod_id := ctx.Param("id")

	var prod modules.Product

	ctx.Bind(&prod)

	//select product from where prod_id = prod_id:
	result := initializers.DB_ptr.First( &prod , prod_id )
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "couldnt find product"})
		return
	}

	initializers.DB_ptr.Model(&prod).
		Updates(modules.Product{	Product_name: prod.Product_name,
									Product_stock: prod.Product_stock,
									Product_price: prod.Product_price,
							})

	ctx.JSON(200 , gin.H{ "product":prod })
}


func DeleteProduct(ctx *gin.Context){
//getting the products id off the URL:
	prod_id := ctx.Param("id")

	result := initializers.DB_ptr.Delete( &modules.Product{}, prod_id)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "couldnt find product , to delete"})
		return
	}

	ctx.JSON(200,gin.H{"message":"successfully deleted product"})
}
