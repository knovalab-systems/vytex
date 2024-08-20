package models

type Query struct {
	Limit  *int   `query:"limit" validate:"omitnil,gte=-1"`
	Offset int    `query:"offset" validate:"gte=0"`
	Page   int    `query:"page" validate:"gte=0"`
	Filter string `query:"filter"`
	Fields string `query:"fields"`
}
