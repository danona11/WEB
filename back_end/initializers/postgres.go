package initializers
import (
	"fmt"
	"log"
  	"gorm.io/driver/postgres"
  	"gorm.io/gorm"
	"github.com/spf13/viper"
)


//A global pointer to the data base, all the functions can use:
var DB_ptr *gorm.DB 	

//initialize the configuration file (config.yaml)
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

func init


func ConnectToDB(){
	
	initConfig()

	host := viper.GetString("database.host") 
	user := viper.GetString("database.user")
	password := viper.GetString("database.password")
	db_name := viper.GetString("database.db_name")
	port := viper.GetInt("database.port")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable", host, user, password, db_name, port)
	var err error
	// 	opens based on dsn , object that has advanced settings for the ORM
	DB_ptr, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("the connection to the DB hasn't worked")
	}
	fmt.Println("Connected to Database successfully!")
}

