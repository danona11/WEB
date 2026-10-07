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

	router := gin.Default() //used to route a specific route to a function
	//	the router: has 2 functions:
	//		1. logger: record all requests
	//  	2. recovery: protects the server from crashing
	router.SetTrustedProxies(nil)

	//CORS:

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, //the react's address
		AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true, //allows cookie saving in our server
	}))

	//publicRoutes - no need for authentication, so no need for the requireAuth middleware:
	publicRoutes := router.Group("/")
	{
		publicRoutes.POST("/signup", controllers.SendSignUp)
		publicRoutes.POST("/login", controllers.SendLogin)
	}

	//protected routes - will activate requireAuth for all autherized requests
	protectedRoutes := router.Group("/")
	protectedRoutes.Use(middleware.RequireAuth)
	{
		protectedRoutes.GET("/validate", controllers.Validate)

		//products controllers:
		protectedRoutes.POST("/addProduct", controllers.CreateProduct)
		protectedRoutes.PUT("/updateProduct/:id", controllers.UpdateProduct)
		protectedRoutes.DELETE("/deleteProduct/:id", controllers.DeleteProduct)

		protectedRoutes.GET("/products", controllers.ProductIndex)
		protectedRoutes.GET("/products/:id", controllers.ShowProduct)
		
	}

	//start the app:
	router.Run("localhost:8080")
}
