package initializers

import (
	"log"

	"github.com/spf13/viper"
)

// initialize the configuration file (config.yaml)
func InitConfig() {

	viper.SetConfigFile("config.yaml") //the configuration file name(.yaml)
	viper.SetConfigType("yaml")        //the configuration file type
	viper.AddConfigPath(".")           //the configuration file path

	//read the configuration file
	err := viper.ReadInConfig() // if the configuration file is not found, it will return an error
	if err != nil {
		log.Fatalf("Error reading config file, %v", err) //error message using log
	}
}
