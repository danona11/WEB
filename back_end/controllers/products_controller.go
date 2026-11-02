package controllers

import (
	"my-project/initializers"
	"my-project/modules"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
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

func ProductsPagination(ctx *gin.Context) {

	var prodsList []modules.Product
	var totalProducts int64
	var kitsPerPage int = viper.GetInt("kits_per_page") //get the number of kits per page from the config file

	pageString := ctx.Param("page") //take the page num from the url
	page, err := strconv.Atoi(pageString)
	if err != nil || page < 1 {		//incase of an uknown page number - go to page 1
        page = 1
    }
	
	offset := (page - 1) * kitsPerPage	//the first prod in the page

	initializers.DB_ptr.Model(&modules.Product{}).Count(&totalProducts)	//total products in the DB

	result := initializers.DB_ptr.Limit(kitsPerPage).Offset(offset).Find(&prodsList) //limit of kitsPerPage constant prods per page - pagingtation
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to fetch product"})
		return
	}

	maxPage := 1
    if totalProducts > 0 {
        maxPage = int( (totalProducts + int64(kitsPerPage - 1) ) /int64(kitsPerPage) ) //calculate the max page number - if there are 13 products and 5 per page, maxPage = 3
	}
	
//responce following the dto:
	var prodsListResponse []modules.Product
	for _, prod := range prodsList {	

		if prod.ProductPhotoUrl == "" {
			prod.ProductPhotoUrl = viper.GetString("default_kit_image")
		}

		prodsListResponse = append(prodsListResponse, prod)
	}

	ctx.JSON(200, gin.H{ "products": prodsListResponse , "maxPage": maxPage })
}


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
