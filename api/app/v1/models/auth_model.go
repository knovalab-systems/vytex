package models

import (
	"time"
)

// Struct to describe login user
type LoginUser struct {
	UserName string `json:"username" validate:"required,lte=30"`
	Password string `json:"password" validate:"required,lte=20,gte=8"`
}

type DataAuthResponse struct {
	AccessToken string `json:"access_token"`
	Expires     int64  `json:"expires"`
}

type Session struct {
	ID           int `gorm:"primaryKey"`
	ExpiresAt    time.Time
	RefreshToken string
	UserID       string
	User         User
}
