package initializers

import (
	"fmt"
	"log"
	"os"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// A global pointer to the data base, all the functions can use:
var DB_ptr *gorm.DB

func ConnectToDB() {

	host := os.Getenv("host")
	user := os.Getenv("user")
	password := os.Getenv("password")
	dbname := os.Getenv("user")
	port := os.Getenv("port")

	// 	opens based on dsn , object that has advanced settings for the ORM
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, password, dbname, port)
	// dsn := "host=localhost user=postgres password=danp7531 dbname=postgres port=5432 sslmode=disable"
	var err error

	DB_ptr, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("the connection to the DB hasn't worked")
	}
	fmt.Println("Connected to Database successfully!")
}
