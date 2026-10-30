package modules

import (
	"time"

	"gorm.io/gorm"
)

type ReceiptProductsList struct {
	ReceiptID     uint `gorm:"primaryKey;column:receipt_id" json:"ReceiptID"`
	ProductID     uint `gorm:"primaryKey;column:product_id" json:"ProductID"`
	AmountInCart uint  `gorm:"column:amount_in_cart" json:"AmountInCart"`
	ProductPrice     float64 `gorm:"column:product_price" json:"ProductPrice"`

	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
