package modules

import (
	"time"

	"gorm.io/gorm"
)

type ReceiptProductsList struct {
	// Using two primaryKey tags creates a composite primary key
	ReceiptID     uint `gorm:"primaryKey;column:receipt_id" json:"Receipt_id"`
	ProductID     uint `gorm:"primaryKey;column:product_id" json:"Product_id"`
	ProductAmount int  `gorm:"column:product_amount" json:"Product_amount"`

	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
