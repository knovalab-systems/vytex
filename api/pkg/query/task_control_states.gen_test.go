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
	err := _gen_test_db.AutoMigrate(&models.TaskControlState{})
	if err != nil {
		fmt.Printf("Error: AutoMigrate(&models.TaskControlState{}) fail: %s", err)
	}
}

func Test_taskControlStateQuery(t *testing.T) {
	taskControlState := newTaskControlState(_gen_test_db)
	taskControlState = *taskControlState.As(taskControlState.TableName())
	_do := taskControlState.WithContext(context.Background()).Debug()

	primaryKey := field.NewString(taskControlState.TableName(), clause.PrimaryKey)
	_, err := _do.Unscoped().Where(primaryKey.IsNotNull()).Delete()
	if err != nil {
		t.Error("clean table <task_control_states> fail:", err)
		return
	}

	_, ok := taskControlState.GetFieldByName("")
	if ok {
		t.Error("GetFieldByName(\"\") from taskControlState success")
	}

	err = _do.Create(&models.TaskControlState{})
	if err != nil {
		t.Error("create item in table <task_control_states> fail:", err)
	}

	err = _do.Save(&models.TaskControlState{})
	if err != nil {
		t.Error("create item in table <task_control_states> fail:", err)
	}

	err = _do.CreateInBatches([]*models.TaskControlState{{}, {}}, 10)
	if err != nil {
		t.Error("create item in table <task_control_states> fail:", err)
	}

	_, err = _do.Select(taskControlState.ALL).Take()
	if err != nil {
		t.Error("Take() on table <task_control_states> fail:", err)
	}

	_, err = _do.First()
	if err != nil {
		t.Error("First() on table <task_control_states> fail:", err)
	}

	_, err = _do.Last()
	if err != nil {
		t.Error("First() on table <task_control_states> fail:", err)
	}

	_, err = _do.Where(primaryKey.IsNotNull()).FindInBatch(10, func(tx gen.Dao, batch int) error { return nil })
	if err != nil {
		t.Error("FindInBatch() on table <task_control_states> fail:", err)
	}

	err = _do.Where(primaryKey.IsNotNull()).FindInBatches(&[]*models.TaskControlState{}, 10, func(tx gen.Dao, batch int) error { return nil })
	if err != nil {
		t.Error("FindInBatches() on table <task_control_states> fail:", err)
	}

	_, err = _do.Select(taskControlState.ALL).Where(primaryKey.IsNotNull()).Order(primaryKey.Desc()).Find()
	if err != nil {
		t.Error("Find() on table <task_control_states> fail:", err)
	}

	_, err = _do.Distinct(primaryKey).Take()
	if err != nil {
		t.Error("select Distinct() on table <task_control_states> fail:", err)
	}

	_, err = _do.Select(taskControlState.ALL).Omit(primaryKey).Take()
	if err != nil {
		t.Error("Omit() on table <task_control_states> fail:", err)
	}

	_, err = _do.Group(primaryKey).Find()
	if err != nil {
		t.Error("Group() on table <task_control_states> fail:", err)
	}

	_, err = _do.Scopes(func(dao gen.Dao) gen.Dao { return dao.Where(primaryKey.IsNotNull()) }).Find()
	if err != nil {
		t.Error("Scopes() on table <task_control_states> fail:", err)
	}

	_, _, err = _do.FindByPage(0, 1)
	if err != nil {
		t.Error("FindByPage() on table <task_control_states> fail:", err)
	}

	_, err = _do.ScanByPage(&models.TaskControlState{}, 0, 1)
	if err != nil {
		t.Error("ScanByPage() on table <task_control_states> fail:", err)
	}

	_, err = _do.Attrs(primaryKey).Assign(primaryKey).FirstOrInit()
	if err != nil {
		t.Error("FirstOrInit() on table <task_control_states> fail:", err)
	}

	_, err = _do.Attrs(primaryKey).Assign(primaryKey).FirstOrCreate()
	if err != nil {
		t.Error("FirstOrCreate() on table <task_control_states> fail:", err)
	}

	var _a _another
	var _aPK = field.NewString(_a.TableName(), "id")

	err = _do.Join(&_a, primaryKey.EqCol(_aPK)).Scan(map[string]interface{}{})
	if err != nil {
		t.Error("Join() on table <task_control_states> fail:", err)
	}

	err = _do.LeftJoin(&_a, primaryKey.EqCol(_aPK)).Scan(map[string]interface{}{})
	if err != nil {
		t.Error("LeftJoin() on table <task_control_states> fail:", err)
	}

	_, err = _do.Not().Or().Clauses().Take()
	if err != nil {
		t.Error("Not/Or/Clauses on table <task_control_states> fail:", err)
	}
}
