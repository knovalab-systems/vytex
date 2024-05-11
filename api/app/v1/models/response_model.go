package models

type Response struct {
	Data interface{} `json:"data"`
}

type AggregateData struct {
	Count any `json:"count,omitempty"`
}
