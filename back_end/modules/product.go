package modules

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	Product_id    uint    `gorm:"primary_key ; AUTO_INCREMENT"`
	Product_name  string
	Product_stock uint
	Product_price float64
}