package dto

type LoginRequest struct {
	UserName string `json:"UserName"`
	Password string `json:"Password"`
}