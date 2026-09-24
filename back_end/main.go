package main

import (
	"my-project/controllers"
	"my-project/initializers"
	"my-project/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	initializers.ConnectToDB()
	initializers.Migrate()

	router := gin.Default() //used to route a specific route to a function
	//	the router: has 2 functions:
	//		1. logger: record all requests
	//  	2. recovery: protects the server from crashing
	router.SetTrustedProxies(nil)

	//CORS:

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, //the react's address
		AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true, //allows cookie saving in our server
	}))

	//routing:
	//open routes - no need for cookie or token
	router.POST("/Register", controllers.Register)
	router.POST("/Login", controllers.Login)

	//protected routes - will activate requireAuth for all autherized requests
	protectedRoutes := router.Group("/")
	protectedRoutes.Use(middleware.RequireAuth)
	{
		protectedRoutes.GET("/Validate", controllers.Validate)

	}

	//start the app:
	router.Run("localhost:8080")
}
