package modules

import (
    "time"
    "gorm.io/gorm"
)

type Receipt struct {
    ReceiptID uint    `gorm:"primaryKey;column:receipt_id;autoIncrement" json:"ReceiptID"`
    UserID    uint    `gorm:"column:user_id" json:"UserID"`
    User      User    `gorm:"foreignKey:UserID;references:UserID" json:"-"`
    SumPrice  float64 `gorm:"column:sum_price" json:"SumPrice"`

    //relation link for preload("Products")
    Products  []ReceiptProducts `gorm:"foreignKey:ReceiptID;references:ReceiptID" json:"Products"`

    CreatedAt time.Time      `json:"-"`
    UpdatedAt time.Time      `json:"-"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}