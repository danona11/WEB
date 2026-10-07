package modules

import (
	"time"

	"gorm.io/gorm"
)

type ReceiptProductsList struct {
	ReceiptID     uint `gorm:"primaryKey;column:receipt_id" json:"receipt_id"`
	ProductID     uint `gorm:"primaryKey;column:product_id" json:"product_id"`
	ProductAmount uint  `gorm:"column:product_amount" json:"product_amount"`
	ProductPrice     float64 `gorm:"column:product_price" json:"product_price"`

	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
