package services

import (
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
