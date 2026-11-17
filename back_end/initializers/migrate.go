package initializers

import (
	"my-project/models"
)

func Migrate() {
	DB_ptr.AutoMigrate(&models.User{})
	DB_ptr.AutoMigrate(&models.Product{})
	DB_ptr.AutoMigrate(&models.Receipt{})
	DB_ptr.AutoMigrate(&models.ReceiptProducts{})
}
