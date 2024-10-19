package helpers

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func GetComposition(c *models.Composition) (*models.Composition, error) {
	table := query.Composition
	compMap := map[string]interface{}{
		"algod":  c.Algod,
		"elast":  c.Elast,
		"lino":   c.Lino,
		"nylon":  c.Nylon,
		"polye":  c.Polye,
		"rayon":  c.Rayon,
		"rayvis": c.Rayvis,
		"tencel": c.Tencel,
		"visco":  c.Visco,
		"hilom":  c.Hilom,
	} // for allow zero values

	var totalComp uint = 0
	for _, v := range compMap {
		value := v.(uint)
		totalComp = totalComp + value
	}

	if totalComp != 10000 { // check 100%
		return nil, problems.CreateFabricBadRequest()
	}

	composition, err := table.Where(field.Attrs(compMap)).FirstOrCreate()
	if err != nil {
		return nil, problems.ServerError()
	}

	return composition, nil
}
