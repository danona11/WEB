package modules

type User struct {
	User_id     uint   `gorm:"primaryKey ; AUTO_INCREMENT" json:"User_id"` //represented in json
	User_name   string `gorm:"UNIQUE" json:"User_name"`
	Email       string `gorm:"UNIQUE" json:"Email"`
	Password    string `gorm:"UNIQUE" json:"Password"`
	Permissions bool   `json:"Permissions"`
}