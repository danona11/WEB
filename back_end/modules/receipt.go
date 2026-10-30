package modules

import (
	"time"
	"gorm.io/gorm"
)

type Receipt struct {
	ReceiptID    uint                  `gorm:"primaryKey;column:ReceiptID;autoIncrement"`
	UserID       uint                  `gorm:"column:user_id" json:"UserID"` 
	SumPrice     float64               `gorm:"column:sum_price" json:"SumPrice"`
	
	ProductsList []ReceiptProductsList `gorm:"foreignKey:ReceiptID" json:"ProductsList"`

	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
