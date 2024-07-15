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
	err := _gen_test_db.AutoMigrate(&models.Composition{})
	if err != nil {
		fmt.Printf("Error: AutoMigrate(&models.Composition{}) fail: %s", err)
	}
}

func Test_compositionQuery(t *testing.T) {
	composition := newComposition(_gen_test_db)
	composition = *composition.As(composition.TableName())
	_do := composition.WithContext(context.Background()).Debug()

	primaryKey := field.NewString(composition.TableName(), clause.PrimaryKey)
	_, err := _do.Unscoped().Where(primaryKey.IsNotNull()).Delete()
	if err != nil {
		t.Error("clean table <compositions> fail:", err)
		return
	}

	_, ok := composition.GetFieldByName("")
	if ok {
		t.Error("GetFieldByName(\"\") from composition success")
	}

	err = _do.Create(&models.Composition{})
	if err != nil {
		t.Error("create item in table <compositions> fail:", err)
	}

	err = _do.Save(&models.Composition{})
	if err != nil {
		t.Error("create item in table <compositions> fail:", err)
	}

	err = _do.CreateInBatches([]*models.Composition{{}, {}}, 10)
	if err != nil {
		t.Error("create item in table <compositions> fail:", err)
	}

	_, err = _do.Select(composition.ALL).Take()
	if err != nil {
		t.Error("Take() on table <compositions> fail:", err)
	}

	_, err = _do.First()
	if err != nil {
		t.Error("First() on table <compositions> fail:", err)
	}

	_, err = _do.Last()
	if err != nil {
		t.Error("First() on table <compositions> fail:", err)
	}

	_, err = _do.Where(primaryKey.IsNotNull()).FindInBatch(10, func(tx gen.Dao, batch int) error { return nil })
	if err != nil {
		t.Error("FindInBatch() on table <compositions> fail:", err)
	}

	err = _do.Where(primaryKey.IsNotNull()).FindInBatches(&[]*models.Composition{}, 10, func(tx gen.Dao, batch int) error { return nil })
	if err != nil {
		t.Error("FindInBatches() on table <compositions> fail:", err)
	}

	_, err = _do.Select(composition.ALL).Where(primaryKey.IsNotNull()).Order(primaryKey.Desc()).Find()
	if err != nil {
		t.Error("Find() on table <compositions> fail:", err)
	}

	_, err = _do.Distinct(primaryKey).Take()
	if err != nil {
		t.Error("select Distinct() on table <compositions> fail:", err)
	}

	_, err = _do.Select(composition.ALL).Omit(primaryKey).Take()
	if err != nil {
		t.Error("Omit() on table <compositions> fail:", err)
	}

	_, err = _do.Group(primaryKey).Find()
	if err != nil {
		t.Error("Group() on table <compositions> fail:", err)
	}

	_, err = _do.Scopes(func(dao gen.Dao) gen.Dao { return dao.Where(primaryKey.IsNotNull()) }).Find()
	if err != nil {
		t.Error("Scopes() on table <compositions> fail:", err)
	}

	_, _, err = _do.FindByPage(0, 1)
	if err != nil {
		t.Error("FindByPage() on table <compositions> fail:", err)
	}

	_, err = _do.ScanByPage(&models.Composition{}, 0, 1)
	if err != nil {
		t.Error("ScanByPage() on table <compositions> fail:", err)
	}

	_, err = _do.Attrs(primaryKey).Assign(primaryKey).FirstOrInit()
	if err != nil {
		t.Error("FirstOrInit() on table <compositions> fail:", err)
	}

	_, err = _do.Attrs(primaryKey).Assign(primaryKey).FirstOrCreate()
	if err != nil {
		t.Error("FirstOrCreate() on table <compositions> fail:", err)
	}

	var _a _another
	var _aPK = field.NewString(_a.TableName(), "id")

	err = _do.Join(&_a, primaryKey.EqCol(_aPK)).Scan(map[string]interface{}{})
	if err != nil {
		t.Error("Join() on table <compositions> fail:", err)
	}

	err = _do.LeftJoin(&_a, primaryKey.EqCol(_aPK)).Scan(map[string]interface{}{})
	if err != nil {
		t.Error("LeftJoin() on table <compositions> fail:", err)
	}

	_, err = _do.Not().Or().Clauses().Take()
	if err != nil {
		t.Error("Not/Or/Clauses on table <compositions> fail:", err)
	}
}