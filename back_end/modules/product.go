package modules

import (
    "time"
    "gorm.io/gorm"
)

type Product struct {
    ProductID         uint    `gorm:"primaryKey;column:product_id;autoIncrement" json:"ProductID"`
    ProductTeam       string  `gorm:"column:product_team"       json:"ProductTeam"`
    ProductDesign     string  `gorm:"column:product_design;check:product_design IN ('Home','Away','Third','Goalkeeper')"    json:"ProductDesign"`
    ProductYear       int     `gorm:"column:product_year"       json:"ProductYear"`
    ProductName       string  `gorm:"column:product_name"       json:"ProductName"`
    ProductStock      uint    `gorm:"column:product_stock"      json:"ProductStock"`
    ProductPrice      float64 `gorm:"column:product_price"      json:"ProductPrice"`
    ProductPhotoURL   string  `gorm:"column:product_photo_url"  json:"ProductPhotoUrl"`
    
    CreatedAt time.Time      `json:"-"`
    UpdatedAt time.Time      `json:"-"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}