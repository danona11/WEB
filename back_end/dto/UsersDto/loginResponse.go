package dto

type LoginResponse struct {

	UserName 	string 	`json:"UserName"`
	Permissions bool 	`json:"Permissions"`
}