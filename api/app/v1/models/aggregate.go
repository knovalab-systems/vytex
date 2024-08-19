package models

type AggregateData struct {
	Count any `json:"count,omitempty"`
}

type AggregateQuery struct {
	Count  string `query:"count"`
	Filter string `query:"filter"`
}
