package modules

type Receipt_product_list struct {
	Receipt_id     uint `gorm:"primary_key ; column:Receipt_id" json:"Receipt_id"`
	Product_id     uint `gorm:"primary_key ; column:Product_id" json:"Product_id"`
	Product_amount uint `json:"Product_amount"`
}
