package dto
import "time"

type UpdateUserResponse struct{
	UserName    string 		`json:"UserName"` 
	Email       string 		`json:"Email"`
	Permissions bool   		`json:"Permissions"`
	CreatedAt 	time.Time  	`json:"CreatedAt"`
}