package main

import (
	"my-project/controllers"
	"my-project/initializers"
	"my-project/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	initializers.InitConfig()
	initializers.LoadEnvVars()
	initializers.ConnectToDB()
	initializers.Migrate()
	
	router := gin.Default()

	router.SetTrustedProxies(nil)

	//CORS:
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173" ,"http://localhost:5174"}, 
		AllowMethods:     []string{"POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

//publicRoutes - no need for authentication, so no need for the requireAuth middleware:
	publicRoutes := router.Group("/")
	publicRoutes.POST("/signup", controllers.SendSignUp)
	publicRoutes.POST("/login", controllers.SendLogin)


//PROTECTEDROUTES - will activate requireAuth for all authorized requests
	protectedRoutes := router.Group("/")
	protectedRoutes.Use(middleware.RequireAuth)
	protectedRoutes.GET("/validate", controllers.Validate)

	//user controllers:
	protectedRoutes.POST("/logout", controllers.Logout)

	//products controllers:
	protectedRoutes.POST("/addProduct", controllers.CreateProduct)
	protectedRoutes.PUT("/updateProduct/:id", controllers.UpdateProduct)
	protectedRoutes.DELETE("/deleteProduct/:id", controllers.DeleteProduct)
	protectedRoutes.GET("/products", controllers.ProductIndex)
	protectedRoutes.GET("/products/page/:page", controllers.ProductIndex)
	protectedRoutes.GET("/products/:id", controllers.ShowProduct)
	
	//receipts controllers:
	protectedRoutes.POST("/createReceipt", controllers.CreateReceipt)

	//start the app:
	router.Run("localhost:8080") 
}
