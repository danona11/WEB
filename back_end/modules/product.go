package modules

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	ProductID    uint    `gorm:"primaryKey;column:product_id;autoIncrement" json:"ProductID"`
	ProductName  string  `gorm:"column:product_name" json:"ProductName"`
	ProductStock uint    `gorm:"column:product_stock" json:"ProductStock"`
	ProductPrice float64 `gorm:"column:product_price" json:"ProductPrice"`

	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
