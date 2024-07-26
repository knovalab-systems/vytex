package services

import (
	"errors"
	"gorm.io/gorm"
	"reflect"
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

type CustomService struct {
}

func (m *CustomService) SelectCustoms(q *models.Query) ([]*models.Custom, error) {

	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.CustomsBadRequest()
	}

	// def query
	table := query.Custom
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = customFields(s, q.Fields)

	// run query
	customs, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return customs, nil
}

func (m *CustomService) AggregationCustoms(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Custom
	s := table.Unscoped()
	aggregateElem := models.AggregateData{Count: nil}

	if q.Count != "" {
		countArr := strings.Split(q.Count, ",")
		countObj := make(map[string]int64)

		for _, v := range countArr {
			switch v {
			case "id":
				count, err := s.Select(table.ID).Count()
				if err != nil {
					return nil, problems.ServerError()
				}
				countObj["id"] = count
			default:
				if aggregateElem.Count == nil {
					count, err := s.Count()
					if err != nil {
						return nil, problems.ServerError()
					}
					aggregateElem.Count = count
				}
			}
		}
		if len(countObj) > 0 {
			aggregateElem.Count = countObj
		}
	}

	return []*models.AggregateData{&aggregateElem}, nil
}

func (m *CustomService) CreateCustom(b *models.CustomCreateBody) (*models.Custom, error) {

	orders := []models.Order{}
	for _, v := range b.Orders {

		reflectSize := reflect.ValueOf(v.SizeInt)
		total := 0

		for i := 0; i < reflectSize.NumField(); i++ {
			total = total + int(reflectSize.Field(i).Int())
		}

		// must be gt 0
		if total == 0 {
			return nil, problems.CreateCustomBadRequest()
		}

		orders = append(orders, models.Order{Status: models.Created, SizeInt: v.SizeInt, CreatedBy: b.CreatedBy, ColorByReferenceID: v.ColorByReferenceID})
	}

	custom := &models.Custom{CreatedBy: b.CreatedBy, Client: b.Client, Orders: orders}

	err := query.Custom.Create(custom)
	if err != nil {
		return nil, problems.ServerError()
	}

	return custom, nil
}

func customFields(s query.ICustomDo, fields string) query.ICustomDo {
	if fields != "" {
		table := query.Custom
		fieldsArr := strings.Split(fields, ",")
		f := []field.Expr{}

		for _, v := range fieldsArr {

			if strings.HasPrefix(v, "create_user.") {
				f = append(f, table.CreatedBy)
				s = s.Preload(table.CreateUser)
				continue
			}

			if strings.HasPrefix(v, "cancel_user.") {
				f = append(f, table.CanceledBy)
				s = s.Preload(table.CancelUser)
				continue
			}

			switch v {
			case "id":
				f = append(f, table.ID)
			case "client":
				f = append(f, table.Client)
			case "created_at":
				f = append(f, table.CreatedAt)
			case "finished_at":
				f = append(f, table.FinishedAt)
			case "canceled_at":
				f = append(f, table.CanceledAt)
			case "created_by":
				f = append(f, table.CreatedBy)
			case "create_user":
				f = append(f, table.CreatedBy)
				s = s.Preload(table.CreateUser)
			case "canceled_by":
				f = append(f, table.CanceledBy)
			case "cancel_user":
				f = append(f, table.CanceledBy)
				s = s.Preload(table.CancelUser)
			default:
				f = append(f, table.ALL)
			}
		}
		s = s.Select(f...)
	}
	return s
}

func (m *CustomService) SelectCustom(q *models.ReadCustom) (*models.Custom, error) {
	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.CustomsBadRequest()
	}

	// def query
	table := query.Custom
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = customFields(s, q.Fields)

	// run query
	custom, err := s.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	return custom, nil
}
