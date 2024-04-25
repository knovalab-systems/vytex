package utils

type ResponseDetails struct {
	Data interface{} `json:"data"`
}

func NewResponseData(data interface{}) *ResponseDetails {
	return &ResponseDetails{
		Data: data,
	}
}
