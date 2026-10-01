package modules

import "gorm.io/gorm"

type ReceiptProductsList struct {
	gorm.Model
	Receipt_id     uint `gorm:"primary_key ; column:Receipt_id"`
	Product_id     uint `gorm:"secondary_key ; column:Product_id"`
	Product_amount int
}
