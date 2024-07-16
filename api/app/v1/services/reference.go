package services

import (
	"errors"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gorm"
)

type ReferenceService struct {
}

func (m *ReferenceService) CreateReference(b *models.ReferenceCreateBody) (*models.Reference, error) {
	// check reference exists
	err := checkReferenceCode(b.Reference)
	if err != nil {
		return nil, err
	}

	// create base reference
	reference := &models.Reference{Reference: b.Reference, CreatedBy: b.CreatedBy, Front: b.Front, Back: b.Back}

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

func checkReferenceCode(code string) error {
	t := query.Reference

	_, err := t.Unscoped().Where(t.Reference.Eq(code)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return problems.ServerError()
	}
	return problems.ReferenceExists()
}
