package modules


type Product struct {
	Product_id    uint    `gorm:"primary_key ; AUTO_INCREMENT" json:"Product_id"`
	Product_name  string  `json:"Product_name"`
	Product_stock uint    `json:"Product_stock"`
	Product_price float64 `json:"Product_price"`
}