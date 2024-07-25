package services

import (
	"errors"
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
	"gorm.io/gorm"
)

type ReferenceService struct {
}

func (m *ReferenceService) SelectReferences(q *models.Query) ([]*models.Reference, error) {
	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.ReferencesBadRequest()
	}

	// def query
	table := query.Reference
	s := table.Unscoped()

	// def subquery
	table2 := table.As("u2")
	subQuery := table.Unscoped().
		Group(table.Code).
		Select(table.Code, table.CreatedAt.Max().As("created_at_max")).
		As("u2").Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = referenceFields(s, q.Fields)

	// run query
	references, err := s.Unscoped().LeftJoin(subQuery, table2.Code.EqCol(table.Code)).
		Where(field.NewInt64("u2", "created_at_max").EqCol(table.CreatedAt)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return references, nil
}

func (m *ReferenceService) AggregationReferences(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Reference
	s := table.Unscoped().Group(table.Code)
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

func referenceFields(s query.IReferenceDo, fields string) query.IReferenceDo {
	if fields != "" {
		table := query.Reference
		fieldsArr := strings.Split(fields, ",")
		f := []field.Expr{}

		for _, v := range fieldsArr {
			switch v {
			case "id":
				f = append(f, table.ID)
			case "code":
				f = append(f, table.Code)
			case "created_at":
				f = append(f, table.CreatedAt)
			case "deleted_at":
				f = append(f, table.DeletedAt)
			case "created_by":
				f = append(f, table.CreatedBy)
			case "User":
				f = append(f, table.CreatedBy)
				s = s.Preload(table.User)
			case "front":
				f = append(f, table.Front)
			case "front_image":
				f = append(f, table.Front)
				s = s.Preload(table.FrontImage)
			case "back":
				f = append(f, table.Back)
			case "back_image":
				f = append(f, table.Back)
				s = s.Preload(table.BackImage)
			default:
				f = append(f, table.ALL)
			}
		}
		s = s.Select(f...)
	}
	return s
}

func (m *ReferenceService) CreateReference(b *models.ReferenceCreateBody) (*models.Reference, error) {
	// check reference exists
	err := checkReferenceExists(b.Code)
	if err != nil {
		return nil, err
	}

	// format fabrics n resources
	fabricsByReference := []models.FabricByReference{}
	resourcesByReference := []models.ResourceByReference{}
	for _, color := range b.Colors {
		for _, fabric := range color.Fabrics {
			fabricsByReference = append(fabricsByReference,
				models.FabricByReference{FabricId: fabric.Fabric, Size: fabric.Size})
		}
		for _, resource := range color.Resources {
			resourcesByReference = append(resourcesByReference,
				models.ResourceByReference{ResourceId: resource.Resource, Size: resource.Size})
		}
	}

	// format colors
	colorsByReference := []models.ColorByReference{}
	for _, color := range b.Colors {
		colorsByReference = append(colorsByReference, models.ColorByReference{ColorID: color.Color, Fabrics: fabricsByReference, Resources: resourcesByReference})
	}

	// create reference
	reference := &models.Reference{Code: b.Code, CreatedBy: b.CreatedBy, Front: b.Front, Back: b.Back, Colors: colorsByReference}

	err = query.Reference.Create(reference)
	if err != nil {
		return nil, problems.ServerError()
	}

	return reference, nil
}

func checkReferenceExists(code string) error {
	t := query.Reference

	_, err := t.Unscoped().Where(t.Code.Eq(code)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return problems.ServerError()
	}
	return problems.ReferenceExists()
}
