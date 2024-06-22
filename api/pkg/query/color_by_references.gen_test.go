// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package query

import (
	"context"
	"fmt"
	"testing"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gen"
	"gorm.io/gen/field"
	"gorm.io/gorm/clause"
)

func init() {
	InitializeDB()
	err := _gen_test_db.AutoMigrate(&models.ColorByReference{})
	if err != nil {
		fmt.Printf("Error: AutoMigrate(&models.ColorByReference{}) fail: %s", err)
	}
}

func Test_colorByReferenceQuery(t *testing.T) {
	colorByReference := newColorByReference(_gen_test_db)
	colorByReference = *colorByReference.As(colorByReference.TableName())
	_do := colorByReference.WithContext(context.Background()).Debug()

	primaryKey := field.NewString(colorByReference.TableName(), clause.PrimaryKey)
	_, err := _do.Unscoped().Where(primaryKey.IsNotNull()).Delete()
	if err != nil {
		t.Error("clean table <color_by_references> fail:", err)
		return
	}

	_, ok := colorByReference.GetFieldByName("")
	if ok {
		t.Error("GetFieldByName(\"\") from colorByReference success")
	}

	err = _do.Create(&models.ColorByReference{})
	if err != nil {
		t.Error("create item in table <color_by_references> fail:", err)
	}

	err = _do.Save(&models.ColorByReference{})
	if err != nil {
		t.Error("create item in table <color_by_references> fail:", err)
	}

	err = _do.CreateInBatches([]*models.ColorByReference{{}, {}}, 10)
	if err != nil {
		t.Error("create item in table <color_by_references> fail:", err)
	}

	_, err = _do.Select(colorByReference.ALL).Take()
	if err != nil {
		t.Error("Take() on table <color_by_references> fail:", err)
	}

	_, err = _do.First()
	if err != nil {
		t.Error("First() on table <color_by_references> fail:", err)
	}

	_, err = _do.Last()
	if err != nil {
		t.Error("First() on table <color_by_references> fail:", err)
	}

	_, err = _do.Where(primaryKey.IsNotNull()).FindInBatch(10, func(tx gen.Dao, batch int) error { return nil })
	if err != nil {
		t.Error("FindInBatch() on table <color_by_references> fail:", err)
	}

	err = _do.Where(primaryKey.IsNotNull()).FindInBatches(&[]*models.ColorByReference{}, 10, func(tx gen.Dao, batch int) error { return nil })
	if err != nil {
		t.Error("FindInBatches() on table <color_by_references> fail:", err)
	}

	_, err = _do.Select(colorByReference.ALL).Where(primaryKey.IsNotNull()).Order(primaryKey.Desc()).Find()
	if err != nil {
		t.Error("Find() on table <color_by_references> fail:", err)
	}

	_, err = _do.Distinct(primaryKey).Take()
	if err != nil {
		t.Error("select Distinct() on table <color_by_references> fail:", err)
	}

	_, err = _do.Select(colorByReference.ALL).Omit(primaryKey).Take()
	if err != nil {
		t.Error("Omit() on table <color_by_references> fail:", err)
	}

	_, err = _do.Group(primaryKey).Find()
	if err != nil {
		t.Error("Group() on table <color_by_references> fail:", err)
	}

	_, err = _do.Scopes(func(dao gen.Dao) gen.Dao { return dao.Where(primaryKey.IsNotNull()) }).Find()
	if err != nil {
		t.Error("Scopes() on table <color_by_references> fail:", err)
	}

	_, _, err = _do.FindByPage(0, 1)
	if err != nil {
		t.Error("FindByPage() on table <color_by_references> fail:", err)
	}

	_, err = _do.ScanByPage(&models.ColorByReference{}, 0, 1)
	if err != nil {
		t.Error("ScanByPage() on table <color_by_references> fail:", err)
	}

	_, err = _do.Attrs(primaryKey).Assign(primaryKey).FirstOrInit()
	if err != nil {
		t.Error("FirstOrInit() on table <color_by_references> fail:", err)
	}

	_, err = _do.Attrs(primaryKey).Assign(primaryKey).FirstOrCreate()
	if err != nil {
		t.Error("FirstOrCreate() on table <color_by_references> fail:", err)
	}

	var _a _another
	var _aPK = field.NewString(_a.TableName(), "id")

	err = _do.Join(&_a, primaryKey.EqCol(_aPK)).Scan(map[string]interface{}{})
	if err != nil {
		t.Error("Join() on table <color_by_references> fail:", err)
	}

	err = _do.LeftJoin(&_a, primaryKey.EqCol(_aPK)).Scan(map[string]interface{}{})
	if err != nil {
		t.Error("LeftJoin() on table <color_by_references> fail:", err)
	}

	_, err = _do.Not().Or().Clauses().Take()
	if err != nil {
		t.Error("Not/Or/Clauses on table <color_by_references> fail:", err)
	}
}
