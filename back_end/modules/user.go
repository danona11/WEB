package modules

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	UserID      uint   `gorm:"primaryKey;column:user_id;autoIncrement"`
	UserName    string `gorm:"column:user_name" json:"User_name"` 
	Email       string `gorm:"column:email" json:"Email"`
	Password    string `gorm:"column:password" json:"Password"`
	Permissions bool   `gorm:"column:permissions" json:"Permissions"`

	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}