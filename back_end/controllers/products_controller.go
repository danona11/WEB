package controllers

import (
	"fmt"
	"my-project/dto/ProductsDto"
	"my-project/initializers"
	"my-project/modules"
	"my-project/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func CreateProduct(ctx *gin.Context) {

	var productInfo dto.CreateProductRequest

	ctx.Bind(&productInfo)

	if !utils.IsValidDesign(productInfo.ProductDesign) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid design - must be either: Home, Away, Third or Goalkeeper"})
		return
	}

	if !utils.IsValidYear(productInfo.ProductYear) {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": `Invalid year - must be between 2020-2026` })
        return
    }

	result := initializers.DB_ptr.Create(&productInfo)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to create products"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "successfully added product"})
}

func ProductsPagination(ctx *gin.Context) {

	var prodsList []modules.Product
	var totalProducts int64
	var kitsPerPage int = viper.GetInt("kits_per_page") //get the const number of kits per page from the config file

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
	
	var response []dto.GetProductsResponse
	for _, product := range prodsList {
		
		prod := dto.GetProductsResponse{
			ProductID: 		product.ProductID,
			ProductTeam:	product.ProductTeam,
			ProductDesign:	product.ProductDesign,
			ProductYear:	product.ProductYear,
			ProductName:    product.ProductName,
			ProductStock:   product.ProductStock,
			ProductPrice:   product.ProductPrice,
			ProductPhotoURL:product.ProductPhotoURL,
		}

		if prod.ProductPhotoURL == "" {
			prod.ProductPhotoURL = viper.GetString("default_kit_image")
		}

		response = append(response, prod)
	}

	ctx.JSON(200, gin.H{ "Products": response , "MaxPage": maxPage , "ProductsPerPage": kitsPerPage})
}


func SearchProduct(ctx *gin.Context) {
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
	prod_id := ctx.Param("id")				//the product to update

	var upd_prod dto.UpdateProductRequest	//the updated fields
	ctx.Bind(&upd_prod)
	
	if !utils.IsValidDesign(upd_prod.ProductDesign) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid design. Must be Home, Away, Third or Goalkeeper"})
		return
	}

	if !utils.IsValidYear(upd_prod.ProductYear) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid year - must be between %d - %d", utils.MinYear , utils.MaxYear) })
        return
    }

	var old_prod modules.Product

	//select product from where id = prod_id:
	result := initializers.DB_ptr.First(&old_prod, prod_id)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "couldnt find product"})
		return
	}

	initializers.DB_ptr.Model(&old_prod).
		Updates(modules.Product{
			ProductTeam:	upd_prod.ProductTeam,
			ProductDesign:	upd_prod.ProductDesign,
			ProductYear:	upd_prod.ProductYear,
			ProductName:    upd_prod.ProductName,
			ProductStock:   upd_prod.ProductStock,
			ProductPrice:   upd_prod.ProductPrice,
		})

	ctx.JSON(200, gin.H{"product": old_prod})
}

func DeleteProduct(ctx *gin.Context) {
	//getting the products name off the URL:
	prodID := ctx.Param("id")

	result := initializers.DB_ptr.Delete(&modules.Product{}, prodID)
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "couldnt find product , to delete"})
		return
	}

	ctx.JSON(200, gin.H{"message": "successfully deleted product"})
}


func GetProductValidFields(ctx *gin.Context){
	
	var ValidTeams []string 
	initializers.DB_ptr.Model(&modules.Product{}).Distinct("product_team").Pluck("product_team",&ValidTeams)

	ctx.JSON(http.StatusOK , gin.H{
		"ValidTeams": ValidTeams ,
		"ValidDesigns": utils.ValidDesigns ,
		"ValidYears" : utils.ValidDesigns,
	})
}