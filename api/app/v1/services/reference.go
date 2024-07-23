package services

import (
	"errors"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
	"gorm.io/gorm"
	"strings"
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
				s = s.Select(table.ID.Count().As("id"))
				countObj["id"] = 1
			case "code":
				s = s.Select(table.Code.Count().As("code"))
				countObj["code"] = 1
			//case "colors.color_id":
			//	s = s.Select(table.Colors.ColorID.Count().As("colors.color_id"))
			//	countObj["colors.color_id"] = 1
			//case "colors.fabrics_id":
			//	s = s.Select(table.Colors.FabricsID.Count().As("colors.fabrics_id"))
			//	countObj["colors.fabrics_id"] = 1
			//case "colors.resources_id":
			//	s = s.Select(table.Colors.ResourcesID.Count().As("colors.resources_id"))
			//	countObj["colors.resources_id"] = 1
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

	// create base reference
	reference := &models.Reference{Code: b.Code, CreatedBy: b.CreatedBy, Front: b.Front, Back: b.Back}

	err = query.Reference.Create(reference)
	if err != nil {
		return nil, problems.ServerError()
	}

	// create colors
	colorsByReference := []*models.ColorByReference{}
	for _, color := range b.Colors {
		colorsByReference = append(colorsByReference, &models.ColorByReference{ReferenceID: reference.ID, ColorID: color.Color})
	}

	err = query.ColorByReference.Create(colorsByReference...)
	if err != nil {
		return nil, problems.ServerError()
	}

	// create fabrics n resources
	fabricsByReference := []*models.FabricByReference{}
	resourcesByReference := []*models.ResourceByReference{}
	for i, color := range b.Colors {
		for _, fabric := range color.Fabrics {
			fabricsByReference = append(fabricsByReference,
				&models.FabricByReference{FabricId: fabric.Fabric, ColorByReferenceID: colorsByReference[i].ID, Size: fabric.Size})
		}
		for _, resource := range color.Resources {
			resourcesByReference = append(resourcesByReference,
				&models.ResourceByReference{ResourceId: resource.Resource, ColorByReferenceID: colorsByReference[i].ID, Size: resource.Size})
		}
	}

	err = query.FabricByReference.Create(fabricsByReference...)
	if err != nil {
		return nil, problems.ServerError()
	}

	err = query.ResourceByReference.Create(resourcesByReference...)
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
