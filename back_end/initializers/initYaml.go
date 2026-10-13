package initializers

import (
	"log"
	"github.com/spf13/viper"
)
func InitConfig() {

	viper.SetConfigFile("config.yaml") //the configuration file name
	viper.SetConfigType("yaml")        //the configuration file type
	viper.AddConfigPath(".")           //the configuration file path

	//read the configuration file
	err := viper.ReadInConfig() // if the configuration file is not found
	if err != nil {
		log.Fatalf("Error reading config file, %v", err)
	}
}
