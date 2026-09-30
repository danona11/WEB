package modules

import "gorm.io/gorm"

type User struct {
	gorm.Model
	User_id     uint `gorm:"primaryKey ; AUTO_INCREMENT"`
	User_name   string
	Email       string
	Password    string
	Permissions bool
}