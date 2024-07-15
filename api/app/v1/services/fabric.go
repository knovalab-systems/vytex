package services

import (
	"errors"
	"regexp"
	"strings"

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
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.FabricsBadRequest()
	}

	// def query
	table := query.Fabric
	s := table.Unscoped()

	// def subquery
	table2 := table.As("u2")
	subQuery := table.Unscoped().
		Group(table.Key).
		Select(table.Key, table.CreatedAt.Max().As("created_at_max")).
		As("u2").Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = fabricFields(s, q.Fields)

	// run query
	fabrics, err := s.Unscoped().LeftJoin(subQuery, table2.Key.EqCol(table.Key)).
		Where(field.NewInt64("u2", "created_at_max").EqCol(table.CreatedAt)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return fabrics, nil
}

func (m *FabricService) AggregationFabrics(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Fabric
	s := table.Unscoped().Group(table.Key)
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

	c, err := getCompositionId(&b.Composition)
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

func fabricFields(s query.IFabricDo, fields string) query.IFabricDo {
	if fields != "" {
		table := query.Fabric
		fieldsArr := strings.Split(fields, ",")
		f := []field.Expr{}

		for _, v := range fieldsArr {

			if strings.HasPrefix(v, "color.") {
				s = s.Preload(table.Color)
				continue
			}

			switch v {
			case "id":
				f = append(f, table.ID)
			case "key":
				f = append(f, table.Key)
			case "name":
				f = append(f, table.Name)
			case "cost":
				f = append(f, table.Cost)
			case "code":
				f = append(f, table.Code)
			case "color_id":
				f = append(f, table.ColorID)
			case "color":
				s = s.Preload(table.Color)
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

func checkFabricExists(code string) error {
	table := query.Fabric

	_, err := table.Unscoped().Where(table.Code.Eq(code)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return problems.ServerError()
	}
	return problems.FabricExists()
}

func getCompositionId(c *models.Composition) (*models.Composition, error) {
	table := query.Composition
	compMap := make(map[string]interface{}) // for allow zero values
	compMap["algod"] = c.Algod
	compMap["elast"] = c.Elast
	compMap["lino"] = c.Lino
	compMap["nylon"] = c.Nylon
	compMap["polye"] = c.Polye
	compMap["rayon"] = c.Rayon
	compMap["rayvis"] = c.Rayvis
	compMap["tencel"] = c.Tencel
	compMap["visco"] = c.Visco
	compMap["hilom"] = c.Hilom

	var totalComp uint = 0
	for _, v := range compMap {
		value := v.(uint)
		totalComp = totalComp + value
	}

	if totalComp != 10000 { // check 100%
		return nil, problems.FabricsBadRequest()
	}

	composition, err := table.Where(field.Attrs(compMap)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err := table.Create(c)
			if err != nil {
				return nil, err
			}
			return c, nil
		}
		return nil, problems.ServerError()
	}

	return composition, nil
}
