package modules

import (
	"time"
	"gorm.io/gorm"
)

type Product struct {
	ProductID    uint    `gorm:"primaryKey;column:product_id;autoIncrement"`
	ProductName  string  `gorm:"column:product_name;unique" json:"product_name"`
	ProductStock uint    `gorm:"column:product_stock" json:"product_stock"`
	ProductPrice float64 `gorm:"column:product_price" json:"product_price"`

	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
