package models

import (
	"time"
)

// Data for login
type LoginUser struct {
	Username string `json:"username" validate:"required,lte=30"`
	Password string `json:"password" validate:"required,lte=20,gte=8"`
}

// Response to success login
type DataAuthResponse struct {
	AccessToken string `json:"access_token"`
	Expires     int64  `json:"expires"`
}

// Logged in users data
type Session struct {
	ID           int `gorm:"primaryKey"`
	ExpiresAt    time.Time
	RefreshToken string
	UserID       string
	User         User
}
