package helpers

import (
	"errors"

	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
	"gorm.io/gorm"
)

func CheckFabricExists(code string) error {
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
