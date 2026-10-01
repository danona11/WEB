package modules

import "gorm.io/gorm"

type Receipt struct {
	gorm.Model
	Receipt_id    uint                   `gorm:"primaryKey ; AUTO_INCREMENT"`
	User_id       uint
	Sum_price     float64
	Products_list []ReceiptProductsList `gorm:"foreignKey:Receipt_id"`
}
