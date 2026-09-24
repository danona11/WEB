package initializers

import (
	"fmt"
	"log"
	"os"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// A global pointer to the data base, all the functions can use:
var DB_ptr *gorm.DB

// initialize the configuration file (config.yaml)
func initConfig() {

	viper.SetConfigFile("config.yaml") //the configuration file name(.yaml)
	viper.SetConfigType("yaml")        //the configuration file type
	viper.AddConfigPath(".")           //the configuration file path

	//read the configuration file
	err := viper.ReadInConfig() // if the configuration file is not found, it will return an error
	if err != nil {
		log.Fatalf("Error reading config file, %v", err) //error message using log
	}
}

func init() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

}

func ConnectToDB() {

	host := os.Getenv("database.host")
	user := os.Getenv("database.user")
	password := os.Getenv("database.password")
	db_name := os.Getenv("database.user")
	port := os.Getenv("database.port")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, password, db_name, port)
	var err error
	// 	opens based on dsn , object that has advanced settings for the ORM
	DB_ptr, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("the connection to the DB hasn't worked")
	}
	fmt.Println("Connected to Database successfully!")
}
