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

func newOrder(db *gorm.DB, opts ...gen.DOOption) order {
	_order := order{}

	_order.orderDo.UseDB(db, opts...)
	_order.orderDo.UseModel(&models.Order{})

	tableName := _order.orderDo.TableName()
	_order.ALL = field.NewAsterisk(tableName)
	_order.ID = field.NewUint(tableName, "id")
	_order.Status = field.NewString(tableName, "status")
	_order.CreatedAt = field.NewTime(tableName, "created_at")
	_order.FinishedAt = field.NewTime(tableName, "finished_at")
	_order.CanceledAt = field.NewTime(tableName, "canceled_at")
	_order.ColorByReferenceID = field.NewUint(tableName, "color_by_reference_id")
	_order.CustomID = field.NewUint(tableName, "custom_id")
	_order.CreatedBy = field.NewString(tableName, "created_by")
	_order.CanceledBy = field.NewString(tableName, "canceled_by")
	_order.XS2 = field.NewInt(tableName, "xs2")
	_order.XS = field.NewInt(tableName, "xs")
	_order.S = field.NewInt(tableName, "s")
	_order.M = field.NewInt(tableName, "m")
	_order.L = field.NewInt(tableName, "l")
	_order.XL = field.NewInt(tableName, "xl")
	_order.XL2 = field.NewInt(tableName, "xl2")
	_order.XL3 = field.NewInt(tableName, "xl3")
	_order.XL4 = field.NewInt(tableName, "xl4")
	_order.XL5 = field.NewInt(tableName, "xl5")
	_order.XL6 = field.NewInt(tableName, "xl6")
	_order.XL7 = field.NewInt(tableName, "xl7")
	_order.XL8 = field.NewInt(tableName, "xl8")
	_order.CancelUser = orderBelongsToCancelUser{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("CancelUser", "models.User"),
		Role: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("CancelUser.Role", "models.Role"),
		},
	}

	_order.CreateUser = orderBelongsToCreateUser{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("CreateUser", "models.User"),
	}

	_order.ColorByReference = orderBelongsToColorByReference{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("ColorByReference", "models.ColorByReference"),
		Color: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("ColorByReference.Color", "models.Color"),
		},
		Reference: struct {
			field.RelationField
			User struct {
				field.RelationField
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
			RelationField: field.NewRelation("ColorByReference.Reference", "models.Reference"),
			User: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("ColorByReference.Reference.User", "models.User"),
			},
			FrontImage: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("ColorByReference.Reference.FrontImage", "models.Image"),
			},
			BackImage: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("ColorByReference.Reference.BackImage", "models.Image"),
			},
			TimeByTask: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("ColorByReference.Reference.TimeByTask", "models.TimeByTask"),
			},
			Colors: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("ColorByReference.Reference.Colors", "models.ColorByReference"),
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
			RelationField: field.NewRelation("ColorByReference.Resources", "models.ResourceByReference"),
			Resource: struct {
				field.RelationField
				Color struct {
					field.RelationField
				}
				Supplier struct {
					field.RelationField
				}
			}{
				RelationField: field.NewRelation("ColorByReference.Resources.Resource", "models.Resource"),
				Color: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("ColorByReference.Resources.Resource.Color", "models.Color"),
				},
				Supplier: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("ColorByReference.Resources.Resource.Supplier", "models.Supplier"),
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
			RelationField: field.NewRelation("ColorByReference.Fabrics", "models.FabricByReference"),
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
				RelationField: field.NewRelation("ColorByReference.Fabrics.Fabric", "models.Fabric"),
				Color: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("ColorByReference.Fabrics.Fabric.Color", "models.Color"),
				},
				Supplier: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("ColorByReference.Fabrics.Fabric.Supplier", "models.Supplier"),
				},
				Composition: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("ColorByReference.Fabrics.Fabric.Composition", "models.Composition"),
				},
			},
		},
	}

	_order.Custom = orderBelongsToCustom{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Custom", "models.Custom"),
		CancelUser: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Custom.CancelUser", "models.User"),
		},
		CreateUser: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Custom.CreateUser", "models.User"),
		},
		Orders: struct {
			field.RelationField
			CancelUser struct {
				field.RelationField
			}
			CreateUser struct {
				field.RelationField
			}
			ColorByReference struct {
				field.RelationField
			}
			Custom struct {
				field.RelationField
			}
		}{
			RelationField: field.NewRelation("Custom.Orders", "models.Order"),
			CancelUser: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Custom.Orders.CancelUser", "models.User"),
			},
			CreateUser: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Custom.Orders.CreateUser", "models.User"),
			},
			ColorByReference: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Custom.Orders.ColorByReference", "models.ColorByReference"),
			},
			Custom: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Custom.Orders.Custom", "models.Custom"),
			},
		},
	}

	_order.fillFieldMap()

	return _order
}

type order struct {
	orderDo

	ALL                field.Asterisk
	ID                 field.Uint
	Status             field.String
	CreatedAt          field.Time
	FinishedAt         field.Time
	CanceledAt         field.Time
	ColorByReferenceID field.Uint
	CustomID           field.Uint
	CreatedBy          field.String
	CanceledBy         field.String
	XS2                field.Int
	XS                 field.Int
	S                  field.Int
	M                  field.Int
	L                  field.Int
	XL                 field.Int
	XL2                field.Int
	XL3                field.Int
	XL4                field.Int
	XL5                field.Int
	XL6                field.Int
	XL7                field.Int
	XL8                field.Int
	CancelUser         orderBelongsToCancelUser

	CreateUser orderBelongsToCreateUser

	ColorByReference orderBelongsToColorByReference

	Custom orderBelongsToCustom

	fieldMap map[string]field.Expr
}

func (o order) Table(newTableName string) *order {
	o.orderDo.UseTable(newTableName)
	return o.updateTableName(newTableName)
}

func (o order) As(alias string) *order {
	o.orderDo.DO = *(o.orderDo.As(alias).(*gen.DO))
	return o.updateTableName(alias)
}

func (o *order) updateTableName(table string) *order {
	o.ALL = field.NewAsterisk(table)
	o.ID = field.NewUint(table, "id")
	o.Status = field.NewString(table, "status")
	o.CreatedAt = field.NewTime(table, "created_at")
	o.FinishedAt = field.NewTime(table, "finished_at")
	o.CanceledAt = field.NewTime(table, "canceled_at")
	o.ColorByReferenceID = field.NewUint(table, "color_by_reference_id")
	o.CustomID = field.NewUint(table, "custom_id")
	o.CreatedBy = field.NewString(table, "created_by")
	o.CanceledBy = field.NewString(table, "canceled_by")
	o.XS2 = field.NewInt(table, "xs2")
	o.XS = field.NewInt(table, "xs")
	o.S = field.NewInt(table, "s")
	o.M = field.NewInt(table, "m")
	o.L = field.NewInt(table, "l")
	o.XL = field.NewInt(table, "xl")
	o.XL2 = field.NewInt(table, "xl2")
	o.XL3 = field.NewInt(table, "xl3")
	o.XL4 = field.NewInt(table, "xl4")
	o.XL5 = field.NewInt(table, "xl5")
	o.XL6 = field.NewInt(table, "xl6")
	o.XL7 = field.NewInt(table, "xl7")
	o.XL8 = field.NewInt(table, "xl8")

	o.fillFieldMap()

	return o
}

func (o *order) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := o.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (o *order) fillFieldMap() {
	o.fieldMap = make(map[string]field.Expr, 26)
	o.fieldMap["id"] = o.ID
	o.fieldMap["status"] = o.Status
	o.fieldMap["created_at"] = o.CreatedAt
	o.fieldMap["finished_at"] = o.FinishedAt
	o.fieldMap["canceled_at"] = o.CanceledAt
	o.fieldMap["color_by_reference_id"] = o.ColorByReferenceID
	o.fieldMap["custom_id"] = o.CustomID
	o.fieldMap["created_by"] = o.CreatedBy
	o.fieldMap["canceled_by"] = o.CanceledBy
	o.fieldMap["xs2"] = o.XS2
	o.fieldMap["xs"] = o.XS
	o.fieldMap["s"] = o.S
	o.fieldMap["m"] = o.M
	o.fieldMap["l"] = o.L
	o.fieldMap["xl"] = o.XL
	o.fieldMap["xl2"] = o.XL2
	o.fieldMap["xl3"] = o.XL3
	o.fieldMap["xl4"] = o.XL4
	o.fieldMap["xl5"] = o.XL5
	o.fieldMap["xl6"] = o.XL6
	o.fieldMap["xl7"] = o.XL7
	o.fieldMap["xl8"] = o.XL8

}

func (o order) clone(db *gorm.DB) order {
	o.orderDo.ReplaceConnPool(db.Statement.ConnPool)
	return o
}

func (o order) replaceDB(db *gorm.DB) order {
	o.orderDo.ReplaceDB(db)
	return o
}

type orderBelongsToCancelUser struct {
	db *gorm.DB

	field.RelationField

	Role struct {
		field.RelationField
	}
}

func (a orderBelongsToCancelUser) Where(conds ...field.Expr) *orderBelongsToCancelUser {
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

func (a orderBelongsToCancelUser) WithContext(ctx context.Context) *orderBelongsToCancelUser {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a orderBelongsToCancelUser) Session(session *gorm.Session) *orderBelongsToCancelUser {
	a.db = a.db.Session(session)
	return &a
}

func (a orderBelongsToCancelUser) Model(m *models.Order) *orderBelongsToCancelUserTx {
	return &orderBelongsToCancelUserTx{a.db.Model(m).Association(a.Name())}
}

type orderBelongsToCancelUserTx struct{ tx *gorm.Association }

func (a orderBelongsToCancelUserTx) Find() (result *models.User, err error) {
	return result, a.tx.Find(&result)
}

func (a orderBelongsToCancelUserTx) Append(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a orderBelongsToCancelUserTx) Replace(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a orderBelongsToCancelUserTx) Delete(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a orderBelongsToCancelUserTx) Clear() error {
	return a.tx.Clear()
}

func (a orderBelongsToCancelUserTx) Count() int64 {
	return a.tx.Count()
}

type orderBelongsToCreateUser struct {
	db *gorm.DB

	field.RelationField
}

func (a orderBelongsToCreateUser) Where(conds ...field.Expr) *orderBelongsToCreateUser {
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

func (a orderBelongsToCreateUser) WithContext(ctx context.Context) *orderBelongsToCreateUser {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a orderBelongsToCreateUser) Session(session *gorm.Session) *orderBelongsToCreateUser {
	a.db = a.db.Session(session)
	return &a
}

func (a orderBelongsToCreateUser) Model(m *models.Order) *orderBelongsToCreateUserTx {
	return &orderBelongsToCreateUserTx{a.db.Model(m).Association(a.Name())}
}

type orderBelongsToCreateUserTx struct{ tx *gorm.Association }

func (a orderBelongsToCreateUserTx) Find() (result *models.User, err error) {
	return result, a.tx.Find(&result)
}

func (a orderBelongsToCreateUserTx) Append(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a orderBelongsToCreateUserTx) Replace(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a orderBelongsToCreateUserTx) Delete(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a orderBelongsToCreateUserTx) Clear() error {
	return a.tx.Clear()
}

func (a orderBelongsToCreateUserTx) Count() int64 {
	return a.tx.Count()
}

type orderBelongsToColorByReference struct {
	db *gorm.DB

	field.RelationField

	Color struct {
		field.RelationField
	}
	Reference struct {
		field.RelationField
		User struct {
			field.RelationField
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

func (a orderBelongsToColorByReference) Where(conds ...field.Expr) *orderBelongsToColorByReference {
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

func (a orderBelongsToColorByReference) WithContext(ctx context.Context) *orderBelongsToColorByReference {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a orderBelongsToColorByReference) Session(session *gorm.Session) *orderBelongsToColorByReference {
	a.db = a.db.Session(session)
	return &a
}

func (a orderBelongsToColorByReference) Model(m *models.Order) *orderBelongsToColorByReferenceTx {
	return &orderBelongsToColorByReferenceTx{a.db.Model(m).Association(a.Name())}
}

type orderBelongsToColorByReferenceTx struct{ tx *gorm.Association }

func (a orderBelongsToColorByReferenceTx) Find() (result *models.ColorByReference, err error) {
	return result, a.tx.Find(&result)
}

func (a orderBelongsToColorByReferenceTx) Append(values ...*models.ColorByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a orderBelongsToColorByReferenceTx) Replace(values ...*models.ColorByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a orderBelongsToColorByReferenceTx) Delete(values ...*models.ColorByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a orderBelongsToColorByReferenceTx) Clear() error {
	return a.tx.Clear()
}

func (a orderBelongsToColorByReferenceTx) Count() int64 {
	return a.tx.Count()
}

type orderBelongsToCustom struct {
	db *gorm.DB

	field.RelationField

	CancelUser struct {
		field.RelationField
	}
	CreateUser struct {
		field.RelationField
	}
	Orders struct {
		field.RelationField
		CancelUser struct {
			field.RelationField
		}
		CreateUser struct {
			field.RelationField
		}
		ColorByReference struct {
			field.RelationField
		}
		Custom struct {
			field.RelationField
		}
	}
}

func (a orderBelongsToCustom) Where(conds ...field.Expr) *orderBelongsToCustom {
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

func (a orderBelongsToCustom) WithContext(ctx context.Context) *orderBelongsToCustom {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a orderBelongsToCustom) Session(session *gorm.Session) *orderBelongsToCustom {
	a.db = a.db.Session(session)
	return &a
}

func (a orderBelongsToCustom) Model(m *models.Order) *orderBelongsToCustomTx {
	return &orderBelongsToCustomTx{a.db.Model(m).Association(a.Name())}
}

type orderBelongsToCustomTx struct{ tx *gorm.Association }

func (a orderBelongsToCustomTx) Find() (result *models.Custom, err error) {
	return result, a.tx.Find(&result)
}

func (a orderBelongsToCustomTx) Append(values ...*models.Custom) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a orderBelongsToCustomTx) Replace(values ...*models.Custom) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a orderBelongsToCustomTx) Delete(values ...*models.Custom) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a orderBelongsToCustomTx) Clear() error {
	return a.tx.Clear()
}

func (a orderBelongsToCustomTx) Count() int64 {
	return a.tx.Count()
}

type orderDo struct{ gen.DO }

type IOrderDo interface {
	gen.SubQuery
	Debug() IOrderDo
	WithContext(ctx context.Context) IOrderDo
	WithResult(fc func(tx gen.Dao)) gen.ResultInfo
	ReplaceDB(db *gorm.DB)
	ReadDB() IOrderDo
	WriteDB() IOrderDo
	As(alias string) gen.Dao
	Session(config *gorm.Session) IOrderDo
	Columns(cols ...field.Expr) gen.Columns
	Clauses(conds ...clause.Expression) IOrderDo
	Not(conds ...gen.Condition) IOrderDo
	Or(conds ...gen.Condition) IOrderDo
	Select(conds ...field.Expr) IOrderDo
	Where(conds ...gen.Condition) IOrderDo
	Order(conds ...field.Expr) IOrderDo
	Distinct(cols ...field.Expr) IOrderDo
	Omit(cols ...field.Expr) IOrderDo
	Join(table schema.Tabler, on ...field.Expr) IOrderDo
	LeftJoin(table schema.Tabler, on ...field.Expr) IOrderDo
	RightJoin(table schema.Tabler, on ...field.Expr) IOrderDo
	Group(cols ...field.Expr) IOrderDo
	Having(conds ...gen.Condition) IOrderDo
	Limit(limit int) IOrderDo
	Offset(offset int) IOrderDo
	Count() (count int64, err error)
	Scopes(funcs ...func(gen.Dao) gen.Dao) IOrderDo
	Unscoped() IOrderDo
	Create(values ...*models.Order) error
	CreateInBatches(values []*models.Order, batchSize int) error
	Save(values ...*models.Order) error
	First() (*models.Order, error)
	Take() (*models.Order, error)
	Last() (*models.Order, error)
	Find() ([]*models.Order, error)
	FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.Order, err error)
	FindInBatches(result *[]*models.Order, batchSize int, fc func(tx gen.Dao, batch int) error) error
	Pluck(column field.Expr, dest interface{}) error
	Delete(...*models.Order) (info gen.ResultInfo, err error)
	Update(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	Updates(value interface{}) (info gen.ResultInfo, err error)
	UpdateColumn(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateColumnSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	UpdateColumns(value interface{}) (info gen.ResultInfo, err error)
	UpdateFrom(q gen.SubQuery) gen.Dao
	Attrs(attrs ...field.AssignExpr) IOrderDo
	Assign(attrs ...field.AssignExpr) IOrderDo
	Joins(fields ...field.RelationField) IOrderDo
	Preload(fields ...field.RelationField) IOrderDo
	FirstOrInit() (*models.Order, error)
	FirstOrCreate() (*models.Order, error)
	FindByPage(offset int, limit int) (result []*models.Order, count int64, err error)
	ScanByPage(result interface{}, offset int, limit int) (count int64, err error)
	Scan(result interface{}) (err error)
	Returning(value interface{}, columns ...string) IOrderDo
	UnderlyingDB() *gorm.DB
	schema.Tabler
}

func (o orderDo) Debug() IOrderDo {
	return o.withDO(o.DO.Debug())
}

func (o orderDo) WithContext(ctx context.Context) IOrderDo {
	return o.withDO(o.DO.WithContext(ctx))
}

func (o orderDo) ReadDB() IOrderDo {
	return o.Clauses(dbresolver.Read)
}

func (o orderDo) WriteDB() IOrderDo {
	return o.Clauses(dbresolver.Write)
}

func (o orderDo) Session(config *gorm.Session) IOrderDo {
	return o.withDO(o.DO.Session(config))
}

func (o orderDo) Clauses(conds ...clause.Expression) IOrderDo {
	return o.withDO(o.DO.Clauses(conds...))
}

func (o orderDo) Returning(value interface{}, columns ...string) IOrderDo {
	return o.withDO(o.DO.Returning(value, columns...))
}

func (o orderDo) Not(conds ...gen.Condition) IOrderDo {
	return o.withDO(o.DO.Not(conds...))
}

func (o orderDo) Or(conds ...gen.Condition) IOrderDo {
	return o.withDO(o.DO.Or(conds...))
}

func (o orderDo) Select(conds ...field.Expr) IOrderDo {
	return o.withDO(o.DO.Select(conds...))
}

func (o orderDo) Where(conds ...gen.Condition) IOrderDo {
	return o.withDO(o.DO.Where(conds...))
}

func (o orderDo) Order(conds ...field.Expr) IOrderDo {
	return o.withDO(o.DO.Order(conds...))
}

func (o orderDo) Distinct(cols ...field.Expr) IOrderDo {
	return o.withDO(o.DO.Distinct(cols...))
}

func (o orderDo) Omit(cols ...field.Expr) IOrderDo {
	return o.withDO(o.DO.Omit(cols...))
}

func (o orderDo) Join(table schema.Tabler, on ...field.Expr) IOrderDo {
	return o.withDO(o.DO.Join(table, on...))
}

func (o orderDo) LeftJoin(table schema.Tabler, on ...field.Expr) IOrderDo {
	return o.withDO(o.DO.LeftJoin(table, on...))
}

func (o orderDo) RightJoin(table schema.Tabler, on ...field.Expr) IOrderDo {
	return o.withDO(o.DO.RightJoin(table, on...))
}

func (o orderDo) Group(cols ...field.Expr) IOrderDo {
	return o.withDO(o.DO.Group(cols...))
}

func (o orderDo) Having(conds ...gen.Condition) IOrderDo {
	return o.withDO(o.DO.Having(conds...))
}

func (o orderDo) Limit(limit int) IOrderDo {
	return o.withDO(o.DO.Limit(limit))
}

func (o orderDo) Offset(offset int) IOrderDo {
	return o.withDO(o.DO.Offset(offset))
}

func (o orderDo) Scopes(funcs ...func(gen.Dao) gen.Dao) IOrderDo {
	return o.withDO(o.DO.Scopes(funcs...))
}

func (o orderDo) Unscoped() IOrderDo {
	return o.withDO(o.DO.Unscoped())
}

func (o orderDo) Create(values ...*models.Order) error {
	if len(values) == 0 {
		return nil
	}
	return o.DO.Create(values)
}

func (o orderDo) CreateInBatches(values []*models.Order, batchSize int) error {
	return o.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (o orderDo) Save(values ...*models.Order) error {
	if len(values) == 0 {
		return nil
	}
	return o.DO.Save(values)
}

func (o orderDo) First() (*models.Order, error) {
	if result, err := o.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*models.Order), nil
	}
}

func (o orderDo) Take() (*models.Order, error) {
	if result, err := o.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*models.Order), nil
	}
}

func (o orderDo) Last() (*models.Order, error) {
	if result, err := o.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*models.Order), nil
	}
}

func (o orderDo) Find() ([]*models.Order, error) {
	result, err := o.DO.Find()
	return result.([]*models.Order), err
}

func (o orderDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.Order, err error) {
	buf := make([]*models.Order, 0, batchSize)
	err = o.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (o orderDo) FindInBatches(result *[]*models.Order, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return o.DO.FindInBatches(result, batchSize, fc)
}

func (o orderDo) Attrs(attrs ...field.AssignExpr) IOrderDo {
	return o.withDO(o.DO.Attrs(attrs...))
}

func (o orderDo) Assign(attrs ...field.AssignExpr) IOrderDo {
	return o.withDO(o.DO.Assign(attrs...))
}

func (o orderDo) Joins(fields ...field.RelationField) IOrderDo {
	for _, _f := range fields {
		o = *o.withDO(o.DO.Joins(_f))
	}
	return &o
}

func (o orderDo) Preload(fields ...field.RelationField) IOrderDo {
	for _, _f := range fields {
		o = *o.withDO(o.DO.Preload(_f))
	}
	return &o
}

func (o orderDo) FirstOrInit() (*models.Order, error) {
	if result, err := o.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*models.Order), nil
	}
}

func (o orderDo) FirstOrCreate() (*models.Order, error) {
	if result, err := o.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*models.Order), nil
	}
}

func (o orderDo) FindByPage(offset int, limit int) (result []*models.Order, count int64, err error) {
	result, err = o.Offset(offset).Limit(limit).Find()
	if err != nil {
		return
	}

	if size := len(result); 0 < limit && 0 < size && size < limit {
		count = int64(size + offset)
		return
	}

	count, err = o.Offset(-1).Limit(-1).Count()
	return
}

func (o orderDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = o.Count()
	if err != nil {
		return
	}

	err = o.Offset(offset).Limit(limit).Scan(result)
	return
}

func (o orderDo) Scan(result interface{}) (err error) {
	return o.DO.Scan(result)
}

func (o orderDo) Delete(models ...*models.Order) (result gen.ResultInfo, err error) {
	return o.DO.Delete(models)
}

func (o *orderDo) withDO(do gen.Dao) *orderDo {
	o.DO = *do.(*gen.DO)
	return o
}
