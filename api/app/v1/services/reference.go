package services

import (
	"errors"
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/filters"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/helpers"
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
	formats.SanitizedQuery(q)

	// def query
	table := query.Reference
	s := table.Unscoped()

	// def subquery
	table2 := table.As("u2")
	subQuery := table.Unscoped().
		Group(table.Track).
		Select(table.Track, table.ID.Max().As("id_max")).
		As("u2").Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.ReferenceFields(s, q.Fields)
	}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.ReferenceFilters(s, q.Filter)
		if err != nil {
			return nil, problems.ReferencesBadRequest()
		}
	}

	// run query
	references, err := s.Unscoped().LeftJoin(subQuery, table2.Track.EqCol(table.Track)).
		Where(field.NewInt64("u2", "id_max").EqCol(table.ID)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return references, nil
}

func (m *ReferenceService) SelectReference(q *models.ReferenceRead) (*models.Reference, error) {
	// sanitize
	formats.SanitizedQuery(&q.Query)

	// def query
	table := query.Reference
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.ReferenceFields(s, q.Fields)
	}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.ReferenceFilters(s, q.Filter)
		if err != nil {
			return nil, problems.ReferencesBadRequest()
		}
	}

	// run query
	reference, err := s.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	return reference, nil
}

func (m *ReferenceService) SelectReferenceImages(q *models.ReferenceRead) ([]byte, error) {
	formats.SanitizedQuery(&q.Query)

	// def query
	table := query.Reference
	table2 := query.Image
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// run query
	reference, err := s.
		Preload(query.Reference.FrontImage).
		Preload(query.Reference.BackImage).
		Preload(query.Reference.Pieces).
		Where(table.ID.Eq(q.ID)).
		First()

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	imagePaths := []string{
		reference.FrontImage.Location,
		reference.BackImage.Location,
	}

	for _, piece := range reference.Pieces {
		imagPiece, err2 := table2.Where(table2.ID.Eq(piece.ImageID)).First()
		if err2 != nil {
			return nil, err2
		}

		imagePaths = append(imagePaths, imagPiece.Location)
	}

	zipData, err := helpers.CreateZip(imagePaths)
	if err != nil {
		return nil, problems.ServerError()
	}

	return zipData, nil
}

func (m *ReferenceService) AggregationReferences(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Reference
	s := table.Unscoped().Group(table.Code)
	aggregateElem := models.AggregateData{Count: nil}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.ReferenceFilters(s, q.Filter)
		if err != nil {
			return nil, problems.ReferencesBadRequest()
		}
	}

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

func (m *ReferenceService) CreateReference(b *models.ReferenceCreateBody) (*models.Reference, error) {
	// check reference exists
	err := helpers.CheckReferenceExists(b.Code)
	if err != nil {
		return nil, err
	}

	// format colors, fabrics n resources
	colorsByReference := []models.ColorByReference{}
	for _, color := range b.Colors {
		fabricsByReference := []models.FabricByReference{}
		resourcesByReference := []models.ResourceByReference{}

		for _, fabric := range color.Fabrics {
			fabricsByReference = append(fabricsByReference, models.FabricByReference{FabricId: fabric.Fabric, Size: fabric.Size})
		}

		for _, resource := range color.Resources {
			resourcesByReference = append(resourcesByReference, models.ResourceByReference{ResourceId: resource.Resource, Size: resource.Size})
		}

		colorsByReference = append(colorsByReference, models.ColorByReference{ColorID: color.Color, Fabrics: fabricsByReference, Resources: resourcesByReference})
	}

	// format pieces
	pieceByReference := []models.Piece{}
	for _, piece := range b.Pieces {
		pieceByReference = append(pieceByReference, models.Piece{ImageID: piece.Image})
	}

	operations := []models.Operation{}
	for _, operation := range b.Operations {
		operations = append(operations, models.Operation{Description: operation.Description})
	}

	timeByTask, err := helpers.GetDefaultTimeByTask()
	if err != nil {
		return nil, err
	}

	// create reference
	reference := &models.Reference{
		Code:         b.Code,
		CreatedBy:    b.CreatedBy,
		Front:        b.Front,
		Back:         b.Back,
		Colors:       colorsByReference,
		TimeByTaskID: timeByTask.ID,
		Pieces:       pieceByReference,
		Operations:   operations,
	}

	err = query.Reference.Create(reference)
	if err != nil {
		return nil, problems.ServerError()
	}

	return reference, nil
}

func (m *ReferenceService) UpdateTimesReference(b *models.TimeByTaskReferenceUpdate) (*models.Reference, error) {

	table := query.Reference

	reference, err := table.Unscoped().Where(table.ID.Eq(b.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	defaultTimeByTask, err := helpers.GetDefaultTimeByTask()
	if err != nil {
		return nil, err
	}

	timeByTask, err := helpers.GetTimeByTask(&b.TimeByTask)
	if err != nil {
		return nil, err
	}

	if reference.TimeByTaskID == defaultTimeByTask.ID {
		_, err := table.Where(table.ID.Eq(reference.ID)).Update(table.TimeByTaskID, timeByTask.ID)
		if err != nil {
			return nil, err
		}
		reference.TimeByTaskID = timeByTask.ID
		reference.TimeByTask = timeByTask
		return reference, nil
	}

	reference.ID = 0
	reference.CreatedAt = nil
	reference.TimeByTaskID = timeByTask.ID

	err = table.Create(reference)
	if err != nil {
		return nil, problems.ServerError()
	}

	return reference, nil
}
