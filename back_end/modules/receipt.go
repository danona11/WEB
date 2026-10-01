package modules

import (
	"time"
	"gorm.io/gorm"
)

type Receipt struct {
	ReceiptID    uint                  `gorm:"primaryKey;column:receipt_id;autoIncrement"`
	UserID       uint                  `gorm:"column:user_id" json:"User_id"` 
	SumPrice     float64               `gorm:"column:sum_price" json:"Sum_price"`
	
	// The foreignKey tag points to the ReceiptID field inside ReceiptProductsList
	ProductsList []ReceiptProductsList `gorm:"foreignKey:ReceiptID" json:"-"`

	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
