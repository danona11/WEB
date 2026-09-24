package modules

type Receipt struct {
	Receipt_id    uint                   `gorm:"primaryKey ; AUTO_INCREMENT" json:"Receipt_id"`
	User_id       uint                   `json:"User_id"`
	Sum_price     float64                `json:"Sum_price"`
	Products_list []Receipt_product_list `gorm:"foreignKey:Receipt_id" json:"Products_list"`
}
