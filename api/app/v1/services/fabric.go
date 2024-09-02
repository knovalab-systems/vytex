package services

import (
	"errors"
	"regexp"
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
	"gorm.io/gorm"
)

type FabricService struct {
}

func (m *FabricService) SelectFabrics(q *models.Query) ([]*models.Fabric, error) {

	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.Fabric
	s := table.Unscoped()

	// def subquery
	table2 := table.As("u2")
	subQuery := table.Unscoped().
		Group(table.Track).
		Select(table.Track, table.ID.Max().As("id_max")).
		As("u2").Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = fabricFields(s, q.Fields)

	// run query
	fabrics, err := s.Unscoped().LeftJoin(subQuery, table2.Track.EqCol(table.Track)).
		Where(field.NewInt64("u2", "id_max").EqCol(table.ID)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return fabrics, nil
}

func (m *FabricService) SelectFabric(q *models.FabricRead) (*models.Fabric, error) {
	// sanitize
	formats.SanitizedQuery(&q.Query)

	// def query
	table := query.Fabric
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = fabricFields(s, q.Fields)

	// run query
	fabric, err := s.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	return fabric, nil
}

func (m *FabricService) AggregationFabrics(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Fabric
	s := table.Unscoped().Group(table.Code)
	aggregateElem := models.AggregateData{Count: nil}

	if q.Count != "" {
		re := regexp.MustCompile(`[\[\]]`)
		countArr := strings.Split(re.ReplaceAllString(q.Count, ""), ",")
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

func (m *FabricService) CreateFabric(b *models.FabricCreateBody) (*models.Fabric, error) {

	err := checkFabricExists(b.Code)
	if err != nil {
		return nil, err
	}

	c, err := getComposition(&b.Composition)
	if err != nil {
		return nil, err
	}

	fabric := &models.Fabric{
		Name:          b.Name,
		SupplierID:    b.Supplier,
		ColorID:       b.Color,
		Cost:          b.Cost,
		Code:          b.Code,
		CompositionID: c.ID,
	}

	err = query.Fabric.Create(fabric)
	if err != nil {
		return nil, err
	}

	return fabric, nil
}

func (m *FabricService) UpdateFabric(b *models.FabricUpdateBody) (*models.Fabric, error) {
	table := query.Fabric

	fabric, err := table.Unscoped().Where(table.ID.Eq(b.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	hasChanges, err := formats.FabricUpdateVersion(b, fabric, getComposition, checkFabricExists)
	if err != nil {
		return nil, err
	}

	if hasChanges {
		fabric.ID = 0
		fabric.CreatedAt = nil
		err = table.Create(fabric)
		if err != nil {
			return nil, problems.ServerError()
		}
	}

	return fabric, nil
}

func fabricFields(s query.IFabricDo, fields string) query.IFabricDo {
	if fields != "" {
		table := query.Fabric
		fieldsArr := strings.Split(fields, ",")
		f := []field.Expr{}

		for _, v := range fieldsArr {

			if strings.HasPrefix(v, "color.") {
				f = append(f, table.ColorID)
				s = s.Preload(table.Color)
				continue
			}

			if strings.HasPrefix(v, "supplier.") {
				f = append(f, table.SupplierID)
				s = s.Preload(table.Supplier)
				continue
			}

			if strings.HasPrefix(v, "composition.") {
				f = append(f, table.CompositionID)
				s = s.Preload(table.Composition)
				continue
			}

			switch v {
			case "id":
				f = append(f, table.ID)
			case "name":
				f = append(f, table.Name)
			case "cost":
				f = append(f, table.Cost)
			case "code":
				f = append(f, table.Code)
			case "track":
				f = append(f, table.Track)
			case "color_id":
				f = append(f, table.ColorID)
			case "color":
				f = append(f, table.ColorID)
				s = s.Preload(table.Color)
			case "supplier_id":
				f = append(f, table.SupplierID)
			case "supplier":
				f = append(f, table.SupplierID)
				s = s.Preload(table.Supplier)
			case "created_at":
				f = append(f, table.CreatedAt)
			case "deleted_at":
				f = append(f, table.DeletedAt)
			case "composition_id":
				f = append(f, table.CompositionID)
			default:
				f = append(f, table.ALL)
			}
		}
		s = s.Select(f...)
	}
	return s
}

func checkFabricExists(code string) error {
	table := query.Fabric

	// def subquery
	table2 := table.As("table2")
	subQuery := table.Unscoped().
		Group(table.Track).
		Select(table.Track, table.ID.Max().As("id_max")).
		As("table2")

	_, err := table.Unscoped().LeftJoin(subQuery, table2.Track.EqCol(table.Track)).
		Where(table.Where(field.NewInt64("table2", "id_max").EqCol(table.ID)).Where(table.Code.Eq(code))).
		First()

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return problems.ServerError()
	}
	return problems.FabricExists()
}

func getComposition(c *models.Composition) (*models.Composition, error) {
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
