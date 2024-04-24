package models

// Struct to describe login user
type LoginUser struct {
	UserName string `json:"username" validate:"required,lte=120,lowercase"`
	Password string `json:"password" validate:"required,lte=120,gte=8"`
}

type LoginRespose struct {
	AccessToken string `json:"access_token"`
	Expires     int64  `json:"expires"`
}
