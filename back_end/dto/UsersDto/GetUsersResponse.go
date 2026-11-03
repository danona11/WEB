package dto

import "time"

type GetUsersResponse struct {
	UserID      uint      `json:"UserID"`
	UserName    string    `json:"UserName"`
	Email       string    `json:"Email"`
	Permissions bool      `json:"Permissions"`
	CreatedAt   time.Time `json:"RegisterDate"`
}