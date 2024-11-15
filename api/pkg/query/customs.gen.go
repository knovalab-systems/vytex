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

func newCustom(db *gorm.DB, opts ...gen.DOOption) custom {
	_custom := custom{}

	_custom.customDo.UseDB(db, opts...)
	_custom.customDo.UseModel(&models.Custom{})

	tableName := _custom.customDo.TableName()
	_custom.ALL = field.NewAsterisk(tableName)
	_custom.ID = field.NewUint(tableName, "id")
	_custom.Client = field.NewString(tableName, "client")
	_custom.CreatedAt = field.NewTime(tableName, "created_at")
	_custom.FinishedAt = field.NewTime(tableName, "finished_at")
	_custom.CanceledAt = field.NewTime(tableName, "canceled_at")
	_custom.CreatedBy = field.NewString(tableName, "created_by")
	_custom.CanceledBy = field.NewString(tableName, "canceled_by")
	_custom.Orders = customHasManyOrders{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Orders", "models.Order"),
		OrderState: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Orders.OrderState", "models.OrderState"),
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
				Pieces struct {
					field.RelationField
					Image struct {
						field.RelationField
					}
				}
				Operations struct {
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
			RelationField: field.NewRelation("Orders.ColorByReference", "models.ColorByReference"),
			Color: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Orders.ColorByReference.Color", "models.Color"),
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
				Pieces struct {
					field.RelationField
					Image struct {
						field.RelationField
					}
				}
				Operations struct {
					field.RelationField
				}
			}{
				RelationField: field.NewRelation("Orders.ColorByReference.Reference", "models.Reference"),
				User: struct {
					field.RelationField
					Role struct {
						field.RelationField
					}
				}{
					RelationField: field.NewRelation("Orders.ColorByReference.Reference.User", "models.User"),
					Role: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Orders.ColorByReference.Reference.User.Role", "models.Role"),
					},
				},
				FrontImage: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Orders.ColorByReference.Reference.FrontImage", "models.Image"),
				},
				BackImage: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Orders.ColorByReference.Reference.BackImage", "models.Image"),
				},
				TimeByTask: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Orders.ColorByReference.Reference.TimeByTask", "models.TimeByTask"),
				},
				Colors: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Orders.ColorByReference.Reference.Colors", "models.ColorByReference"),
				},
				Pieces: struct {
					field.RelationField
					Image struct {
						field.RelationField
					}
				}{
					RelationField: field.NewRelation("Orders.ColorByReference.Reference.Pieces", "models.Piece"),
					Image: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Orders.ColorByReference.Reference.Pieces.Image", "models.Image"),
					},
				},
				Operations: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Orders.ColorByReference.Reference.Operations", "models.Operation"),
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
				RelationField: field.NewRelation("Orders.ColorByReference.Resources", "models.ResourceByReference"),
				Resource: struct {
					field.RelationField
					Color struct {
						field.RelationField
					}
					Supplier struct {
						field.RelationField
					}
				}{
					RelationField: field.NewRelation("Orders.ColorByReference.Resources.Resource", "models.Resource"),
					Color: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Orders.ColorByReference.Resources.Resource.Color", "models.Color"),
					},
					Supplier: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Orders.ColorByReference.Resources.Resource.Supplier", "models.Supplier"),
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
				RelationField: field.NewRelation("Orders.ColorByReference.Fabrics", "models.FabricByReference"),
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
					RelationField: field.NewRelation("Orders.ColorByReference.Fabrics.Fabric", "models.Fabric"),
					Color: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Orders.ColorByReference.Fabrics.Fabric.Color", "models.Color"),
					},
					Supplier: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Orders.ColorByReference.Fabrics.Fabric.Supplier", "models.Supplier"),
					},
					Composition: struct {
						field.RelationField
					}{
						RelationField: field.NewRelation("Orders.ColorByReference.Fabrics.Fabric.Composition", "models.Composition"),
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
			RelationField: field.NewRelation("Orders.Custom", "models.Custom"),
			CancelUser: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Orders.Custom.CancelUser", "models.User"),
			},
			CreateUser: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Orders.Custom.CreateUser", "models.User"),
			},
			Orders: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Orders.Custom.Orders", "models.Order"),
			},
		},
		CreateUser: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Orders.CreateUser", "models.User"),
		},
		CancelUser: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Orders.CancelUser", "models.User"),
		},
	}

	_custom.CancelUser = customBelongsToCancelUser{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("CancelUser", "models.User"),
	}

	_custom.CreateUser = customBelongsToCreateUser{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("CreateUser", "models.User"),
	}

	_custom.fillFieldMap()

	return _custom
}

type custom struct {
	customDo

	ALL        field.Asterisk
	ID         field.Uint
	Client     field.String
	CreatedAt  field.Time
	FinishedAt field.Time
	CanceledAt field.Time
	CreatedBy  field.String
	CanceledBy field.String
	Orders     customHasManyOrders

	CancelUser customBelongsToCancelUser

	CreateUser customBelongsToCreateUser

	fieldMap map[string]field.Expr
}

func (c custom) Table(newTableName string) *custom {
	c.customDo.UseTable(newTableName)
	return c.updateTableName(newTableName)
}

func (c custom) As(alias string) *custom {
	c.customDo.DO = *(c.customDo.As(alias).(*gen.DO))
	return c.updateTableName(alias)
}

func (c *custom) updateTableName(table string) *custom {
	c.ALL = field.NewAsterisk(table)
	c.ID = field.NewUint(table, "id")
	c.Client = field.NewString(table, "client")
	c.CreatedAt = field.NewTime(table, "created_at")
	c.FinishedAt = field.NewTime(table, "finished_at")
	c.CanceledAt = field.NewTime(table, "canceled_at")
	c.CreatedBy = field.NewString(table, "created_by")
	c.CanceledBy = field.NewString(table, "canceled_by")

	c.fillFieldMap()

	return c
}

func (c *custom) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := c.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (c *custom) fillFieldMap() {
	c.fieldMap = make(map[string]field.Expr, 10)
	c.fieldMap["id"] = c.ID
	c.fieldMap["client"] = c.Client
	c.fieldMap["created_at"] = c.CreatedAt
	c.fieldMap["finished_at"] = c.FinishedAt
	c.fieldMap["canceled_at"] = c.CanceledAt
	c.fieldMap["created_by"] = c.CreatedBy
	c.fieldMap["canceled_by"] = c.CanceledBy

}

func (c custom) clone(db *gorm.DB) custom {
	c.customDo.ReplaceConnPool(db.Statement.ConnPool)
	return c
}

func (c custom) replaceDB(db *gorm.DB) custom {
	c.customDo.ReplaceDB(db)
	return c
}

type customHasManyOrders struct {
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
			Pieces struct {
				field.RelationField
				Image struct {
					field.RelationField
				}
			}
			Operations struct {
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

func (a customHasManyOrders) Where(conds ...field.Expr) *customHasManyOrders {
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

func (a customHasManyOrders) WithContext(ctx context.Context) *customHasManyOrders {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a customHasManyOrders) Session(session *gorm.Session) *customHasManyOrders {
	a.db = a.db.Session(session)
	return &a
}

func (a customHasManyOrders) Model(m *models.Custom) *customHasManyOrdersTx {
	return &customHasManyOrdersTx{a.db.Model(m).Association(a.Name())}
}

type customHasManyOrdersTx struct{ tx *gorm.Association }

func (a customHasManyOrdersTx) Find() (result []*models.Order, err error) {
	return result, a.tx.Find(&result)
}

func (a customHasManyOrdersTx) Append(values ...*models.Order) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a customHasManyOrdersTx) Replace(values ...*models.Order) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a customHasManyOrdersTx) Delete(values ...*models.Order) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a customHasManyOrdersTx) Clear() error {
	return a.tx.Clear()
}

func (a customHasManyOrdersTx) Count() int64 {
	return a.tx.Count()
}

type customBelongsToCancelUser struct {
	db *gorm.DB

	field.RelationField
}

func (a customBelongsToCancelUser) Where(conds ...field.Expr) *customBelongsToCancelUser {
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

func (a customBelongsToCancelUser) WithContext(ctx context.Context) *customBelongsToCancelUser {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a customBelongsToCancelUser) Session(session *gorm.Session) *customBelongsToCancelUser {
	a.db = a.db.Session(session)
	return &a
}

func (a customBelongsToCancelUser) Model(m *models.Custom) *customBelongsToCancelUserTx {
	return &customBelongsToCancelUserTx{a.db.Model(m).Association(a.Name())}
}

type customBelongsToCancelUserTx struct{ tx *gorm.Association }

func (a customBelongsToCancelUserTx) Find() (result *models.User, err error) {
	return result, a.tx.Find(&result)
}

func (a customBelongsToCancelUserTx) Append(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a customBelongsToCancelUserTx) Replace(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a customBelongsToCancelUserTx) Delete(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a customBelongsToCancelUserTx) Clear() error {
	return a.tx.Clear()
}

func (a customBelongsToCancelUserTx) Count() int64 {
	return a.tx.Count()
}

type customBelongsToCreateUser struct {
	db *gorm.DB

	field.RelationField
}

func (a customBelongsToCreateUser) Where(conds ...field.Expr) *customBelongsToCreateUser {
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

func (a customBelongsToCreateUser) WithContext(ctx context.Context) *customBelongsToCreateUser {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a customBelongsToCreateUser) Session(session *gorm.Session) *customBelongsToCreateUser {
	a.db = a.db.Session(session)
	return &a
}

func (a customBelongsToCreateUser) Model(m *models.Custom) *customBelongsToCreateUserTx {
	return &customBelongsToCreateUserTx{a.db.Model(m).Association(a.Name())}
}

type customBelongsToCreateUserTx struct{ tx *gorm.Association }

func (a customBelongsToCreateUserTx) Find() (result *models.User, err error) {
	return result, a.tx.Find(&result)
}

func (a customBelongsToCreateUserTx) Append(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a customBelongsToCreateUserTx) Replace(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a customBelongsToCreateUserTx) Delete(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a customBelongsToCreateUserTx) Clear() error {
	return a.tx.Clear()
}

func (a customBelongsToCreateUserTx) Count() int64 {
	return a.tx.Count()
}

type customDo struct{ gen.DO }

type ICustomDo interface {
	gen.SubQuery
	Debug() ICustomDo
	WithContext(ctx context.Context) ICustomDo
	WithResult(fc func(tx gen.Dao)) gen.ResultInfo
	ReplaceDB(db *gorm.DB)
	ReadDB() ICustomDo
	WriteDB() ICustomDo
	As(alias string) gen.Dao
	Session(config *gorm.Session) ICustomDo
	Columns(cols ...field.Expr) gen.Columns
	Clauses(conds ...clause.Expression) ICustomDo
	Not(conds ...gen.Condition) ICustomDo
	Or(conds ...gen.Condition) ICustomDo
	Select(conds ...field.Expr) ICustomDo
	Where(conds ...gen.Condition) ICustomDo
	Order(conds ...field.Expr) ICustomDo
	Distinct(cols ...field.Expr) ICustomDo
	Omit(cols ...field.Expr) ICustomDo
	Join(table schema.Tabler, on ...field.Expr) ICustomDo
	LeftJoin(table schema.Tabler, on ...field.Expr) ICustomDo
	RightJoin(table schema.Tabler, on ...field.Expr) ICustomDo
	Group(cols ...field.Expr) ICustomDo
	Having(conds ...gen.Condition) ICustomDo
	Limit(limit int) ICustomDo
	Offset(offset int) ICustomDo
	Count() (count int64, err error)
	Scopes(funcs ...func(gen.Dao) gen.Dao) ICustomDo
	Unscoped() ICustomDo
	Create(values ...*models.Custom) error
	CreateInBatches(values []*models.Custom, batchSize int) error
	Save(values ...*models.Custom) error
	First() (*models.Custom, error)
	Take() (*models.Custom, error)
	Last() (*models.Custom, error)
	Find() ([]*models.Custom, error)
	FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.Custom, err error)
	FindInBatches(result *[]*models.Custom, batchSize int, fc func(tx gen.Dao, batch int) error) error
	Pluck(column field.Expr, dest interface{}) error
	Delete(...*models.Custom) (info gen.ResultInfo, err error)
	Update(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	Updates(value interface{}) (info gen.ResultInfo, err error)
	UpdateColumn(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateColumnSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	UpdateColumns(value interface{}) (info gen.ResultInfo, err error)
	UpdateFrom(q gen.SubQuery) gen.Dao
	Attrs(attrs ...field.AssignExpr) ICustomDo
	Assign(attrs ...field.AssignExpr) ICustomDo
	Joins(fields ...field.RelationField) ICustomDo
	Preload(fields ...field.RelationField) ICustomDo
	FirstOrInit() (*models.Custom, error)
	FirstOrCreate() (*models.Custom, error)
	FindByPage(offset int, limit int) (result []*models.Custom, count int64, err error)
	ScanByPage(result interface{}, offset int, limit int) (count int64, err error)
	Scan(result interface{}) (err error)
	Returning(value interface{}, columns ...string) ICustomDo
	UnderlyingDB() *gorm.DB
	schema.Tabler
}

func (c customDo) Debug() ICustomDo {
	return c.withDO(c.DO.Debug())
}

func (c customDo) WithContext(ctx context.Context) ICustomDo {
	return c.withDO(c.DO.WithContext(ctx))
}

func (c customDo) ReadDB() ICustomDo {
	return c.Clauses(dbresolver.Read)
}

func (c customDo) WriteDB() ICustomDo {
	return c.Clauses(dbresolver.Write)
}

func (c customDo) Session(config *gorm.Session) ICustomDo {
	return c.withDO(c.DO.Session(config))
}

func (c customDo) Clauses(conds ...clause.Expression) ICustomDo {
	return c.withDO(c.DO.Clauses(conds...))
}

func (c customDo) Returning(value interface{}, columns ...string) ICustomDo {
	return c.withDO(c.DO.Returning(value, columns...))
}

func (c customDo) Not(conds ...gen.Condition) ICustomDo {
	return c.withDO(c.DO.Not(conds...))
}

func (c customDo) Or(conds ...gen.Condition) ICustomDo {
	return c.withDO(c.DO.Or(conds...))
}

func (c customDo) Select(conds ...field.Expr) ICustomDo {
	return c.withDO(c.DO.Select(conds...))
}

func (c customDo) Where(conds ...gen.Condition) ICustomDo {
	return c.withDO(c.DO.Where(conds...))
}

func (c customDo) Order(conds ...field.Expr) ICustomDo {
	return c.withDO(c.DO.Order(conds...))
}

func (c customDo) Distinct(cols ...field.Expr) ICustomDo {
	return c.withDO(c.DO.Distinct(cols...))
}

func (c customDo) Omit(cols ...field.Expr) ICustomDo {
	return c.withDO(c.DO.Omit(cols...))
}

func (c customDo) Join(table schema.Tabler, on ...field.Expr) ICustomDo {
	return c.withDO(c.DO.Join(table, on...))
}

func (c customDo) LeftJoin(table schema.Tabler, on ...field.Expr) ICustomDo {
	return c.withDO(c.DO.LeftJoin(table, on...))
}

func (c customDo) RightJoin(table schema.Tabler, on ...field.Expr) ICustomDo {
	return c.withDO(c.DO.RightJoin(table, on...))
}

func (c customDo) Group(cols ...field.Expr) ICustomDo {
	return c.withDO(c.DO.Group(cols...))
}

func (c customDo) Having(conds ...gen.Condition) ICustomDo {
	return c.withDO(c.DO.Having(conds...))
}

func (c customDo) Limit(limit int) ICustomDo {
	return c.withDO(c.DO.Limit(limit))
}

func (c customDo) Offset(offset int) ICustomDo {
	return c.withDO(c.DO.Offset(offset))
}

func (c customDo) Scopes(funcs ...func(gen.Dao) gen.Dao) ICustomDo {
	return c.withDO(c.DO.Scopes(funcs...))
}

func (c customDo) Unscoped() ICustomDo {
	return c.withDO(c.DO.Unscoped())
}

func (c customDo) Create(values ...*models.Custom) error {
	if len(values) == 0 {
		return nil
	}
	return c.DO.Create(values)
}

func (c customDo) CreateInBatches(values []*models.Custom, batchSize int) error {
	return c.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (c customDo) Save(values ...*models.Custom) error {
	if len(values) == 0 {
		return nil
	}
	return c.DO.Save(values)
}

func (c customDo) First() (*models.Custom, error) {
	if result, err := c.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*models.Custom), nil
	}
}

func (c customDo) Take() (*models.Custom, error) {
	if result, err := c.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*models.Custom), nil
	}
}

func (c customDo) Last() (*models.Custom, error) {
	if result, err := c.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*models.Custom), nil
	}
}

func (c customDo) Find() ([]*models.Custom, error) {
	result, err := c.DO.Find()
	return result.([]*models.Custom), err
}

func (c customDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.Custom, err error) {
	buf := make([]*models.Custom, 0, batchSize)
	err = c.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (c customDo) FindInBatches(result *[]*models.Custom, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return c.DO.FindInBatches(result, batchSize, fc)
}

func (c customDo) Attrs(attrs ...field.AssignExpr) ICustomDo {
	return c.withDO(c.DO.Attrs(attrs...))
}

func (c customDo) Assign(attrs ...field.AssignExpr) ICustomDo {
	return c.withDO(c.DO.Assign(attrs...))
}

func (c customDo) Joins(fields ...field.RelationField) ICustomDo {
	for _, _f := range fields {
		c = *c.withDO(c.DO.Joins(_f))
	}
	return &c
}

func (c customDo) Preload(fields ...field.RelationField) ICustomDo {
	for _, _f := range fields {
		c = *c.withDO(c.DO.Preload(_f))
	}
	return &c
}

func (c customDo) FirstOrInit() (*models.Custom, error) {
	if result, err := c.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*models.Custom), nil
	}
}

func (c customDo) FirstOrCreate() (*models.Custom, error) {
	if result, err := c.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*models.Custom), nil
	}
}

func (c customDo) FindByPage(offset int, limit int) (result []*models.Custom, count int64, err error) {
	result, err = c.Offset(offset).Limit(limit).Find()
	if err != nil {
		return
	}

	if size := len(result); 0 < limit && 0 < size && size < limit {
		count = int64(size + offset)
		return
	}

	count, err = c.Offset(-1).Limit(-1).Count()
	return
}

func (c customDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = c.Count()
	if err != nil {
		return
	}

	err = c.Offset(offset).Limit(limit).Scan(result)
	return
}

func (c customDo) Scan(result interface{}) (err error) {
	return c.DO.Scan(result)
}

func (c customDo) Delete(models ...*models.Custom) (result gen.ResultInfo, err error) {
	return c.DO.Delete(models)
}

func (c *customDo) withDO(do gen.Dao) *customDo {
	c.DO = *do.(*gen.DO)
	return c
}
