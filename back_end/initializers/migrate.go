package initializers
import(
	"my-project/modules"
)


func Migrate(){
	DB_ptr.AutoMigrate(&modules.User{})
	DB_ptr.AutoMigrate(&modules.Product{})
	DB_ptr.AutoMigrate(&modules.Receipt{})
	DB_ptr.AutoMigrate(&modules.Receipt_product_list{})
}