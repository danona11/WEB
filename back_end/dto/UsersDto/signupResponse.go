package dto

type SignupResponse struct{
	UserName 	string `json:"UserName"`
	Permissions bool   `json:"Permissions"`
}