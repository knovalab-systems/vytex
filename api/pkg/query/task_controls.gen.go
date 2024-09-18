// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package query

import (
	"context"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/schema"

	"gorm.io/gen"
	"gorm.io/gen/field"

	"gorm.io/plugin/dbresolver"

	"github.com/knovalab-systems/vytex/app/v1/models"
)

func newTaskControl(db *gorm.DB, opts ...gen.DOOption) taskControl {
	_taskControl := taskControl{}

	_taskControl.taskControlDo.UseDB(db, opts...)
	_taskControl.taskControlDo.UseModel(&models.TaskControl{})

	tableName := _taskControl.taskControlDo.TableName()
	_taskControl.ALL = field.NewAsterisk(tableName)
	_taskControl.ID = field.NewUint(tableName, "id")
	_taskControl.CreatedAt = field.NewTime(tableName, "created_at")
	_taskControl.StartedAt = field.NewTime(tableName, "started_at")
	_taskControl.FinishedAt = field.NewTime(tableName, "finished_at")
	_taskControl.RejectedAt = field.NewTime(tableName, "rejected_at")
	_taskControl.TaskID = field.NewUint(tableName, "task_id")
	_taskControl.OrderID = field.NewUint(tableName, "order_id")
	_taskControl.NextID = field.NewUint(tableName, "next_id")
	_taskControl.PreviousID = field.NewUint(tableName, "previous_id")
	_taskControl.Task = taskControlBelongsToTask{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Task", "models.Task"),
		Step: struct {
			field.RelationField
			Tasks struct {
				field.RelationField
			}
		}{
			RelationField: field.NewRelation("Task.Step", "models.Step"),
			Tasks: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Task.Step.Tasks", "models.Task"),
			},
		},
	}

	_taskControl.Order = taskControlBelongsToOrder{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Order", "models.Order"),
		OrderState: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Order.OrderState", "models.OrderState"),
		},
		ColorByReference: struct {
			field.RelationField
			Color struct {
				field.RelationField
			}
			Reference struct {
				field.RelationField
				User struct {
					field.RelationField
					Role struct {
						field.RelationField
					}
				}
				FrontImage struct {
					field.RelationField
				}
				BackImage struct {
					field.RelationField
				}
				TimeByTask struct {
					field.RelationField
				}
				Colors struct {
					field.RelationField
				}
			}
			Resources struct {
				field.RelationField
				Resource struct {
					field.RelationField
					Color struct {
						field.RelationField
					}
					Supplier struct {
						field.RelationField
					}
				}
			}
			Fabrics struct {
				field.RelationField
				Fabric struct {
					field.RelationField
					Color struct {
						field.RelationField
					}
					Supplier struct {
						field.RelationField
					}
					Composition struct {
						field.RelationField
					}
				}
			}
		}{
			RelationField: field.NewRelation("Order.ColorByReference", "models.ColorByReference"),
			Color: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Order.ColorByReference.Color", "models.Color"),
			},
			Reference: struct {
				field.RelationField
				User struct {
					field.RelationField
					Role struct {
						field.RelationField
					}
				}
				FrontImage struct {
					field.RelationField
				}
				BackImage struct {
					field.RelationField
				}
				TimeByTask struct {
					field.RelationField
				}
				Colors struct {
					field.RelationField
				}
			}{
				RelationField: field.NewRelation("Order.ColorByReference.Reference", "models.Reference"),
				User: struct {
					field.RelationField
					Role struct {
						field.RelationField
					}
				}{
					RelationField: field.NewRelation("Order.ColorByReference.Reference.User", "models.User"),
					Role: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Order.ColorByReference.Reference.User.Role", "models.Role"),
					},
				},
				FrontImage: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Order.ColorByReference.Reference.FrontImage", "models.Image"),
				},
				BackImage: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Order.ColorByReference.Reference.BackImage", "models.Image"),
				},
				TimeByTask: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Order.ColorByReference.Reference.TimeByTask", "models.TimeByTask"),
				},
				Colors: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Order.ColorByReference.Reference.Colors", "models.ColorByReference"),
				},
			},
			Resources: struct {
				field.RelationField
				Resource struct {
					field.RelationField
					Color struct {
						field.RelationField
					}
					Supplier struct {
						field.RelationField
					}
				}
			}{
				RelationField: field.NewRelation("Order.ColorByReference.Resources", "models.ResourceByReference"),
				Resource: struct {
					field.RelationField
					Color struct {
						field.RelationField
					}
					Supplier struct {
						field.RelationField
					}
				}{
					RelationField: field.NewRelation("Order.ColorByReference.Resources.Resource", "models.Resource"),
					Color: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Order.ColorByReference.Resources.Resource.Color", "models.Color"),
					},
					Supplier: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Order.ColorByReference.Resources.Resource.Supplier", "models.Supplier"),
					},
				},
			},
			Fabrics: struct {
				field.RelationField
				Fabric struct {
					field.RelationField
					Color struct {
						field.RelationField
					}
					Supplier struct {
						field.RelationField
					}
					Composition struct {
						field.RelationField
					}
				}
			}{
				RelationField: field.NewRelation("Order.ColorByReference.Fabrics", "models.FabricByReference"),
				Fabric: struct {
					field.RelationField
					Color struct {
						field.RelationField
					}
					Supplier struct {
						field.RelationField
					}
					Composition struct {
						field.RelationField
					}
				}{
					RelationField: field.NewRelation("Order.ColorByReference.Fabrics.Fabric", "models.Fabric"),
					Color: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Order.ColorByReference.Fabrics.Fabric.Color", "models.Color"),
					},
					Supplier: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Order.ColorByReference.Fabrics.Fabric.Supplier", "models.Supplier"),
					},
					Composition: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Order.ColorByReference.Fabrics.Fabric.Composition", "models.Composition"),
					},
				},
			},
		},
		Custom: struct {
			field.RelationField
			CancelUser struct {
				field.RelationField
			}
			CreateUser struct {
				field.RelationField
			}
			Orders struct {
				field.RelationField
			}
		}{
			RelationField: field.NewRelation("Order.Custom", "models.Custom"),
			CancelUser: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Order.Custom.CancelUser", "models.User"),
			},
			CreateUser: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Order.Custom.CreateUser", "models.User"),
			},
			Orders: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Order.Custom.Orders", "models.Order"),
			},
		},
		CreateUser: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Order.CreateUser", "models.User"),
		},
		CancelUser: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Order.CancelUser", "models.User"),
		},
	}

	_taskControl.Next = taskControlBelongsToNext{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Next", "models.TaskControl"),
		Task: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Next.Task", "models.Task"),
		},
		Order: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Next.Order", "models.Order"),
		},
		Next: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Next.Next", "models.TaskControl"),
		},
		Previous: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Next.Previous", "models.TaskControl"),
		},
	}

	_taskControl.Previous = taskControlBelongsToPrevious{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Previous", "models.TaskControl"),
	}

	_taskControl.fillFieldMap()

	return _taskControl
}

type taskControl struct {
	taskControlDo

	ALL        field.Asterisk
	ID         field.Uint
	CreatedAt  field.Time
	StartedAt  field.Time
	FinishedAt field.Time
	RejectedAt field.Time
	TaskID     field.Uint
	OrderID    field.Uint
	NextID     field.Uint
	PreviousID field.Uint
	Task       taskControlBelongsToTask

	Order taskControlBelongsToOrder

	Next taskControlBelongsToNext

	Previous taskControlBelongsToPrevious

	fieldMap map[string]field.Expr
}

func (t taskControl) Table(newTableName string) *taskControl {
	t.taskControlDo.UseTable(newTableName)
	return t.updateTableName(newTableName)
}

func (t taskControl) As(alias string) *taskControl {
	t.taskControlDo.DO = *(t.taskControlDo.As(alias).(*gen.DO))
	return t.updateTableName(alias)
}

func (t *taskControl) updateTableName(table string) *taskControl {
	t.ALL = field.NewAsterisk(table)
	t.ID = field.NewUint(table, "id")
	t.CreatedAt = field.NewTime(table, "created_at")
	t.StartedAt = field.NewTime(table, "started_at")
	t.FinishedAt = field.NewTime(table, "finished_at")
	t.RejectedAt = field.NewTime(table, "rejected_at")
	t.TaskID = field.NewUint(table, "task_id")
	t.OrderID = field.NewUint(table, "order_id")
	t.NextID = field.NewUint(table, "next_id")
	t.PreviousID = field.NewUint(table, "previous_id")

	t.fillFieldMap()

	return t
}

func (t *taskControl) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := t.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (t *taskControl) fillFieldMap() {
	t.fieldMap = make(map[string]field.Expr, 13)
	t.fieldMap["id"] = t.ID
	t.fieldMap["created_at"] = t.CreatedAt
	t.fieldMap["started_at"] = t.StartedAt
	t.fieldMap["finished_at"] = t.FinishedAt
	t.fieldMap["rejected_at"] = t.RejectedAt
	t.fieldMap["task_id"] = t.TaskID
	t.fieldMap["order_id"] = t.OrderID
	t.fieldMap["next_id"] = t.NextID
	t.fieldMap["previous_id"] = t.PreviousID

}

func (t taskControl) clone(db *gorm.DB) taskControl {
	t.taskControlDo.ReplaceConnPool(db.Statement.ConnPool)
	return t
}

func (t taskControl) replaceDB(db *gorm.DB) taskControl {
	t.taskControlDo.ReplaceDB(db)
	return t
}

type taskControlBelongsToTask struct {
	db *gorm.DB

	field.RelationField

	Step struct {
		field.RelationField
		Tasks struct {
			field.RelationField
		}
	}
}

func (a taskControlBelongsToTask) Where(conds ...field.Expr) *taskControlBelongsToTask {
	if len(conds) == 0 {
		return &a
	}

	exprs := make([]clause.Expression, 0, len(conds))
	for _, cond := range conds {
		exprs = append(exprs, cond.BeCond().(clause.Expression))
	}
	a.db = a.db.Clauses(clause.Where{Exprs: exprs})
	return &a
}

func (a taskControlBelongsToTask) WithContext(ctx context.Context) *taskControlBelongsToTask {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a taskControlBelongsToTask) Session(session *gorm.Session) *taskControlBelongsToTask {
	a.db = a.db.Session(session)
	return &a
}

func (a taskControlBelongsToTask) Model(m *models.TaskControl) *taskControlBelongsToTaskTx {
	return &taskControlBelongsToTaskTx{a.db.Model(m).Association(a.Name())}
}

type taskControlBelongsToTaskTx struct{ tx *gorm.Association }

func (a taskControlBelongsToTaskTx) Find() (result *models.Task, err error) {
	return result, a.tx.Find(&result)
}

func (a taskControlBelongsToTaskTx) Append(values ...*models.Task) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a taskControlBelongsToTaskTx) Replace(values ...*models.Task) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a taskControlBelongsToTaskTx) Delete(values ...*models.Task) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a taskControlBelongsToTaskTx) Clear() error {
	return a.tx.Clear()
}

func (a taskControlBelongsToTaskTx) Count() int64 {
	return a.tx.Count()
}

type taskControlBelongsToOrder struct {
	db *gorm.DB

	field.RelationField

	OrderState struct {
		field.RelationField
	}
	ColorByReference struct {
		field.RelationField
		Color struct {
			field.RelationField
		}
		Reference struct {
			field.RelationField
			User struct {
				field.RelationField
				Role struct {
					field.RelationField
				}
			}
			FrontImage struct {
				field.RelationField
			}
			BackImage struct {
				field.RelationField
			}
			TimeByTask struct {
				field.RelationField
			}
			Colors struct {
				field.RelationField
			}
		}
		Resources struct {
			field.RelationField
			Resource struct {
				field.RelationField
				Color struct {
					field.RelationField
				}
				Supplier struct {
					field.RelationField
				}
			}
		}
		Fabrics struct {
			field.RelationField
			Fabric struct {
				field.RelationField
				Color struct {
					field.RelationField
				}
				Supplier struct {
					field.RelationField
				}
				Composition struct {
					field.RelationField
				}
			}
		}
	}
	Custom struct {
		field.RelationField
		CancelUser struct {
			field.RelationField
		}
		CreateUser struct {
			field.RelationField
		}
		Orders struct {
			field.RelationField
		}
	}
	CreateUser struct {
		field.RelationField
	}
	CancelUser struct {
		field.RelationField
	}
}

func (a taskControlBelongsToOrder) Where(conds ...field.Expr) *taskControlBelongsToOrder {
	if len(conds) == 0 {
		return &a
	}

	exprs := make([]clause.Expression, 0, len(conds))
	for _, cond := range conds {
		exprs = append(exprs, cond.BeCond().(clause.Expression))
	}
	a.db = a.db.Clauses(clause.Where{Exprs: exprs})
	return &a
}

func (a taskControlBelongsToOrder) WithContext(ctx context.Context) *taskControlBelongsToOrder {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a taskControlBelongsToOrder) Session(session *gorm.Session) *taskControlBelongsToOrder {
	a.db = a.db.Session(session)
	return &a
}

func (a taskControlBelongsToOrder) Model(m *models.TaskControl) *taskControlBelongsToOrderTx {
	return &taskControlBelongsToOrderTx{a.db.Model(m).Association(a.Name())}
}

type taskControlBelongsToOrderTx struct{ tx *gorm.Association }

func (a taskControlBelongsToOrderTx) Find() (result *models.Order, err error) {
	return result, a.tx.Find(&result)
}

func (a taskControlBelongsToOrderTx) Append(values ...*models.Order) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a taskControlBelongsToOrderTx) Replace(values ...*models.Order) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a taskControlBelongsToOrderTx) Delete(values ...*models.Order) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a taskControlBelongsToOrderTx) Clear() error {
	return a.tx.Clear()
}

func (a taskControlBelongsToOrderTx) Count() int64 {
	return a.tx.Count()
}

type taskControlBelongsToNext struct {
	db *gorm.DB

	field.RelationField

	Task struct {
		field.RelationField
	}
	Order struct {
		field.RelationField
	}
	Next struct {
		field.RelationField
	}
	Previous struct {
		field.RelationField
	}
}

func (a taskControlBelongsToNext) Where(conds ...field.Expr) *taskControlBelongsToNext {
	if len(conds) == 0 {
		return &a
	}

	exprs := make([]clause.Expression, 0, len(conds))
	for _, cond := range conds {
		exprs = append(exprs, cond.BeCond().(clause.Expression))
	}
	a.db = a.db.Clauses(clause.Where{Exprs: exprs})
	return &a
}

func (a taskControlBelongsToNext) WithContext(ctx context.Context) *taskControlBelongsToNext {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a taskControlBelongsToNext) Session(session *gorm.Session) *taskControlBelongsToNext {
	a.db = a.db.Session(session)
	return &a
}

func (a taskControlBelongsToNext) Model(m *models.TaskControl) *taskControlBelongsToNextTx {
	return &taskControlBelongsToNextTx{a.db.Model(m).Association(a.Name())}
}

type taskControlBelongsToNextTx struct{ tx *gorm.Association }

func (a taskControlBelongsToNextTx) Find() (result *models.TaskControl, err error) {
	return result, a.tx.Find(&result)
}

func (a taskControlBelongsToNextTx) Append(values ...*models.TaskControl) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a taskControlBelongsToNextTx) Replace(values ...*models.TaskControl) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a taskControlBelongsToNextTx) Delete(values ...*models.TaskControl) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a taskControlBelongsToNextTx) Clear() error {
	return a.tx.Clear()
}

func (a taskControlBelongsToNextTx) Count() int64 {
	return a.tx.Count()
}

type taskControlBelongsToPrevious struct {
	db *gorm.DB

	field.RelationField
}

func (a taskControlBelongsToPrevious) Where(conds ...field.Expr) *taskControlBelongsToPrevious {
	if len(conds) == 0 {
		return &a
	}

	exprs := make([]clause.Expression, 0, len(conds))
	for _, cond := range conds {
		exprs = append(exprs, cond.BeCond().(clause.Expression))
	}
	a.db = a.db.Clauses(clause.Where{Exprs: exprs})
	return &a
}

func (a taskControlBelongsToPrevious) WithContext(ctx context.Context) *taskControlBelongsToPrevious {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a taskControlBelongsToPrevious) Session(session *gorm.Session) *taskControlBelongsToPrevious {
	a.db = a.db.Session(session)
	return &a
}

func (a taskControlBelongsToPrevious) Model(m *models.TaskControl) *taskControlBelongsToPreviousTx {
	return &taskControlBelongsToPreviousTx{a.db.Model(m).Association(a.Name())}
}

type taskControlBelongsToPreviousTx struct{ tx *gorm.Association }

func (a taskControlBelongsToPreviousTx) Find() (result *models.TaskControl, err error) {
	return result, a.tx.Find(&result)
}

func (a taskControlBelongsToPreviousTx) Append(values ...*models.TaskControl) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a taskControlBelongsToPreviousTx) Replace(values ...*models.TaskControl) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a taskControlBelongsToPreviousTx) Delete(values ...*models.TaskControl) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a taskControlBelongsToPreviousTx) Clear() error {
	return a.tx.Clear()
}

func (a taskControlBelongsToPreviousTx) Count() int64 {
	return a.tx.Count()
}

type taskControlDo struct{ gen.DO }

type ITaskControlDo interface {
	gen.SubQuery
	Debug() ITaskControlDo
	WithContext(ctx context.Context) ITaskControlDo
	WithResult(fc func(tx gen.Dao)) gen.ResultInfo
	ReplaceDB(db *gorm.DB)
	ReadDB() ITaskControlDo
	WriteDB() ITaskControlDo
	As(alias string) gen.Dao
	Session(config *gorm.Session) ITaskControlDo
	Columns(cols ...field.Expr) gen.Columns
	Clauses(conds ...clause.Expression) ITaskControlDo
	Not(conds ...gen.Condition) ITaskControlDo
	Or(conds ...gen.Condition) ITaskControlDo
	Select(conds ...field.Expr) ITaskControlDo
	Where(conds ...gen.Condition) ITaskControlDo
	Order(conds ...field.Expr) ITaskControlDo
	Distinct(cols ...field.Expr) ITaskControlDo
	Omit(cols ...field.Expr) ITaskControlDo
	Join(table schema.Tabler, on ...field.Expr) ITaskControlDo
	LeftJoin(table schema.Tabler, on ...field.Expr) ITaskControlDo
	RightJoin(table schema.Tabler, on ...field.Expr) ITaskControlDo
	Group(cols ...field.Expr) ITaskControlDo
	Having(conds ...gen.Condition) ITaskControlDo
	Limit(limit int) ITaskControlDo
	Offset(offset int) ITaskControlDo
	Count() (count int64, err error)
	Scopes(funcs ...func(gen.Dao) gen.Dao) ITaskControlDo
	Unscoped() ITaskControlDo
	Create(values ...*models.TaskControl) error
	CreateInBatches(values []*models.TaskControl, batchSize int) error
	Save(values ...*models.TaskControl) error
	First() (*models.TaskControl, error)
	Take() (*models.TaskControl, error)
	Last() (*models.TaskControl, error)
	Find() ([]*models.TaskControl, error)
	FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.TaskControl, err error)
	FindInBatches(result *[]*models.TaskControl, batchSize int, fc func(tx gen.Dao, batch int) error) error
	Pluck(column field.Expr, dest interface{}) error
	Delete(...*models.TaskControl) (info gen.ResultInfo, err error)
	Update(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	Updates(value interface{}) (info gen.ResultInfo, err error)
	UpdateColumn(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateColumnSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	UpdateColumns(value interface{}) (info gen.ResultInfo, err error)
	UpdateFrom(q gen.SubQuery) gen.Dao
	Attrs(attrs ...field.AssignExpr) ITaskControlDo
	Assign(attrs ...field.AssignExpr) ITaskControlDo
	Joins(fields ...field.RelationField) ITaskControlDo
	Preload(fields ...field.RelationField) ITaskControlDo
	FirstOrInit() (*models.TaskControl, error)
	FirstOrCreate() (*models.TaskControl, error)
	FindByPage(offset int, limit int) (result []*models.TaskControl, count int64, err error)
	ScanByPage(result interface{}, offset int, limit int) (count int64, err error)
	Scan(result interface{}) (err error)
	Returning(value interface{}, columns ...string) ITaskControlDo
	UnderlyingDB() *gorm.DB
	schema.Tabler
}

func (t taskControlDo) Debug() ITaskControlDo {
	return t.withDO(t.DO.Debug())
}

func (t taskControlDo) WithContext(ctx context.Context) ITaskControlDo {
	return t.withDO(t.DO.WithContext(ctx))
}

func (t taskControlDo) ReadDB() ITaskControlDo {
	return t.Clauses(dbresolver.Read)
}

func (t taskControlDo) WriteDB() ITaskControlDo {
	return t.Clauses(dbresolver.Write)
}

func (t taskControlDo) Session(config *gorm.Session) ITaskControlDo {
	return t.withDO(t.DO.Session(config))
}

func (t taskControlDo) Clauses(conds ...clause.Expression) ITaskControlDo {
	return t.withDO(t.DO.Clauses(conds...))
}

func (t taskControlDo) Returning(value interface{}, columns ...string) ITaskControlDo {
	return t.withDO(t.DO.Returning(value, columns...))
}

func (t taskControlDo) Not(conds ...gen.Condition) ITaskControlDo {
	return t.withDO(t.DO.Not(conds...))
}

func (t taskControlDo) Or(conds ...gen.Condition) ITaskControlDo {
	return t.withDO(t.DO.Or(conds...))
}

func (t taskControlDo) Select(conds ...field.Expr) ITaskControlDo {
	return t.withDO(t.DO.Select(conds...))
}

func (t taskControlDo) Where(conds ...gen.Condition) ITaskControlDo {
	return t.withDO(t.DO.Where(conds...))
}

func (t taskControlDo) Order(conds ...field.Expr) ITaskControlDo {
	return t.withDO(t.DO.Order(conds...))
}

func (t taskControlDo) Distinct(cols ...field.Expr) ITaskControlDo {
	return t.withDO(t.DO.Distinct(cols...))
}

func (t taskControlDo) Omit(cols ...field.Expr) ITaskControlDo {
	return t.withDO(t.DO.Omit(cols...))
}

func (t taskControlDo) Join(table schema.Tabler, on ...field.Expr) ITaskControlDo {
	return t.withDO(t.DO.Join(table, on...))
}

func (t taskControlDo) LeftJoin(table schema.Tabler, on ...field.Expr) ITaskControlDo {
	return t.withDO(t.DO.LeftJoin(table, on...))
}

func (t taskControlDo) RightJoin(table schema.Tabler, on ...field.Expr) ITaskControlDo {
	return t.withDO(t.DO.RightJoin(table, on...))
}

func (t taskControlDo) Group(cols ...field.Expr) ITaskControlDo {
	return t.withDO(t.DO.Group(cols...))
}

func (t taskControlDo) Having(conds ...gen.Condition) ITaskControlDo {
	return t.withDO(t.DO.Having(conds...))
}

func (t taskControlDo) Limit(limit int) ITaskControlDo {
	return t.withDO(t.DO.Limit(limit))
}

func (t taskControlDo) Offset(offset int) ITaskControlDo {
	return t.withDO(t.DO.Offset(offset))
}

func (t taskControlDo) Scopes(funcs ...func(gen.Dao) gen.Dao) ITaskControlDo {
	return t.withDO(t.DO.Scopes(funcs...))
}

func (t taskControlDo) Unscoped() ITaskControlDo {
	return t.withDO(t.DO.Unscoped())
}

func (t taskControlDo) Create(values ...*models.TaskControl) error {
	if len(values) == 0 {
		return nil
	}
	return t.DO.Create(values)
}

func (t taskControlDo) CreateInBatches(values []*models.TaskControl, batchSize int) error {
	return t.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (t taskControlDo) Save(values ...*models.TaskControl) error {
	if len(values) == 0 {
		return nil
	}
	return t.DO.Save(values)
}

func (t taskControlDo) First() (*models.TaskControl, error) {
	if result, err := t.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*models.TaskControl), nil
	}
}

func (t taskControlDo) Take() (*models.TaskControl, error) {
	if result, err := t.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*models.TaskControl), nil
	}
}

func (t taskControlDo) Last() (*models.TaskControl, error) {
	if result, err := t.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*models.TaskControl), nil
	}
}

func (t taskControlDo) Find() ([]*models.TaskControl, error) {
	result, err := t.DO.Find()
	return result.([]*models.TaskControl), err
}

func (t taskControlDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.TaskControl, err error) {
	buf := make([]*models.TaskControl, 0, batchSize)
	err = t.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (t taskControlDo) FindInBatches(result *[]*models.TaskControl, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return t.DO.FindInBatches(result, batchSize, fc)
}

func (t taskControlDo) Attrs(attrs ...field.AssignExpr) ITaskControlDo {
	return t.withDO(t.DO.Attrs(attrs...))
}

func (t taskControlDo) Assign(attrs ...field.AssignExpr) ITaskControlDo {
	return t.withDO(t.DO.Assign(attrs...))
}

func (t taskControlDo) Joins(fields ...field.RelationField) ITaskControlDo {
	for _, _f := range fields {
		t = *t.withDO(t.DO.Joins(_f))
	}
	return &t
}

func (t taskControlDo) Preload(fields ...field.RelationField) ITaskControlDo {
	for _, _f := range fields {
		t = *t.withDO(t.DO.Preload(_f))
	}
	return &t
}

func (t taskControlDo) FirstOrInit() (*models.TaskControl, error) {
	if result, err := t.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*models.TaskControl), nil
	}
}

func (t taskControlDo) FirstOrCreate() (*models.TaskControl, error) {
	if result, err := t.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*models.TaskControl), nil
	}
}

func (t taskControlDo) FindByPage(offset int, limit int) (result []*models.TaskControl, count int64, err error) {
	result, err = t.Offset(offset).Limit(limit).Find()
	if err != nil {
		return
	}

	if size := len(result); 0 < limit && 0 < size && size < limit {
		count = int64(size + offset)
		return
	}

	count, err = t.Offset(-1).Limit(-1).Count()
	return
}

func (t taskControlDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = t.Count()
	if err != nil {
		return
	}

	err = t.Offset(offset).Limit(limit).Scan(result)
	return
}

func (t taskControlDo) Scan(result interface{}) (err error) {
	return t.DO.Scan(result)
}

func (t taskControlDo) Delete(models ...*models.TaskControl) (result gen.ResultInfo, err error) {
	return t.DO.Delete(models)
}

func (t *taskControlDo) withDO(do gen.Dao) *taskControlDo {
	t.DO = *do.(*gen.DO)
	return t
}
