package dto

type SignupRequest struct {
 	UserName string `json:"UserName"`
 	Email    string `json:"Email"`
 	Password string `json:"Password"`
 }