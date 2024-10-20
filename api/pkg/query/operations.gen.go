// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package query

import (
	"context"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/schema"

	"gorm.io/gen"
	"gorm.io/gen/field"

	"gorm.io/plugin/dbresolver"
)

func newOperation(db *gorm.DB, opts ...gen.DOOption) operation {
	_operation := operation{}

	_operation.operationDo.UseDB(db, opts...)
	_operation.operationDo.UseModel(&models.Operation{})

	tableName := _operation.operationDo.TableName()
	_operation.ALL = field.NewAsterisk(tableName)
	_operation.ID = field.NewUint(tableName, "id")
	_operation.OperationalListID = field.NewUint(tableName, "operational_list_id")
	_operation.Description = field.NewString(tableName, "description")
	_operation.OperationalList = operationBelongsToOperationalList{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("OperationalList", "models.OperationalList"),
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
			OperationalList struct {
				field.RelationField
			}
			Colors struct {
				field.RelationField
				Color struct {
					field.RelationField
				}
				Reference struct {
					field.RelationField
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
			Pieces struct {
				field.RelationField
				Image struct {
					field.RelationField
				}
				Reference struct {
					field.RelationField
				}
			}
		}{
			RelationField: field.NewRelation("OperationalList.Reference", "models.Reference"),
			User: struct {
				field.RelationField
				Role struct {
					field.RelationField
				}
			}{
				RelationField: field.NewRelation("OperationalList.Reference.User", "models.User"),
				Role: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("OperationalList.Reference.User.Role", "models.Role"),
				},
			},
			FrontImage: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("OperationalList.Reference.FrontImage", "models.Image"),
			},
			BackImage: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("OperationalList.Reference.BackImage", "models.Image"),
			},
			TimeByTask: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("OperationalList.Reference.TimeByTask", "models.TimeByTask"),
			},
			OperationalList: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("OperationalList.Reference.OperationalList", "models.OperationalList"),
			},
			Colors: struct {
				field.RelationField
				Color struct {
					field.RelationField
				}
				Reference struct {
					field.RelationField
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
				RelationField: field.NewRelation("OperationalList.Reference.Colors", "models.ColorByReference"),
				Color: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("OperationalList.Reference.Colors.Color", "models.Color"),
				},
				Reference: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("OperationalList.Reference.Colors.Reference", "models.Reference"),
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
					RelationField: field.NewRelation("OperationalList.Reference.Colors.Resources", "models.ResourceByReference"),
					Resource: struct {
						field.RelationField
						Color struct {
							field.RelationField
						}
						Supplier struct {
							field.RelationField
						}
					}{
						RelationField: field.NewRelation("OperationalList.Reference.Colors.Resources.Resource", "models.Resource"),
						Color: struct {
							field.RelationField
						}{
							RelationField: field.NewRelation("OperationalList.Reference.Colors.Resources.Resource.Color", "models.Color"),
						},
						Supplier: struct {
							field.RelationField
						}{
							RelationField: field.NewRelation("OperationalList.Reference.Colors.Resources.Resource.Supplier", "models.Supplier"),
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
					RelationField: field.NewRelation("OperationalList.Reference.Colors.Fabrics", "models.FabricByReference"),
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
						RelationField: field.NewRelation("OperationalList.Reference.Colors.Fabrics.Fabric", "models.Fabric"),
						Color: struct {
							field.RelationField
						}{
							RelationField: field.NewRelation("OperationalList.Reference.Colors.Fabrics.Fabric.Color", "models.Color"),
						},
						Supplier: struct {
							field.RelationField
						}{
							RelationField: field.NewRelation("OperationalList.Reference.Colors.Fabrics.Fabric.Supplier", "models.Supplier"),
						},
						Composition: struct {
							field.RelationField
						}{
							RelationField: field.NewRelation("OperationalList.Reference.Colors.Fabrics.Fabric.Composition", "models.Composition"),
						},
					},
				},
			},
			Pieces: struct {
				field.RelationField
				Image struct {
					field.RelationField
				}
				Reference struct {
					field.RelationField
				}
			}{
				RelationField: field.NewRelation("OperationalList.Reference.Pieces", "models.ImageByReference"),
				Image: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("OperationalList.Reference.Pieces.Image", "models.Image"),
				},
				Reference: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("OperationalList.Reference.Pieces.Reference", "models.Reference"),
				},
			},
		},
		Operations: struct {
			field.RelationField
			OperationalList struct {
				field.RelationField
			}
		}{
			RelationField: field.NewRelation("OperationalList.Operations", "models.Operation"),
			OperationalList: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("OperationalList.Operations.OperationalList", "models.OperationalList"),
			},
		},
	}

	_operation.fillFieldMap()

	return _operation
}

type operation struct {
	operationDo

	ALL               field.Asterisk
	ID                field.Uint
	OperationalListID field.Uint
	Description       field.String
	OperationalList   operationBelongsToOperationalList

	fieldMap map[string]field.Expr
}

func (o operation) Table(newTableName string) *operation {
	o.operationDo.UseTable(newTableName)
	return o.updateTableName(newTableName)
}

func (o operation) As(alias string) *operation {
	o.operationDo.DO = *(o.operationDo.As(alias).(*gen.DO))
	return o.updateTableName(alias)
}

func (o *operation) updateTableName(table string) *operation {
	o.ALL = field.NewAsterisk(table)
	o.ID = field.NewUint(table, "id")
	o.OperationalListID = field.NewUint(table, "operational_list_id")
	o.Description = field.NewString(table, "description")

	o.fillFieldMap()

	return o
}

func (o *operation) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := o.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (o *operation) fillFieldMap() {
	o.fieldMap = make(map[string]field.Expr, 4)
	o.fieldMap["id"] = o.ID
	o.fieldMap["operational_list_id"] = o.OperationalListID
	o.fieldMap["description"] = o.Description

}

func (o operation) clone(db *gorm.DB) operation {
	o.operationDo.ReplaceConnPool(db.Statement.ConnPool)
	return o
}

func (o operation) replaceDB(db *gorm.DB) operation {
	o.operationDo.ReplaceDB(db)
	return o
}

type operationBelongsToOperationalList struct {
	db *gorm.DB

	field.RelationField

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
		OperationalList struct {
			field.RelationField
		}
		Colors struct {
			field.RelationField
			Color struct {
				field.RelationField
			}
			Reference struct {
				field.RelationField
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
		Pieces struct {
			field.RelationField
			Image struct {
				field.RelationField
			}
			Reference struct {
				field.RelationField
			}
		}
	}
	Operations struct {
		field.RelationField
		OperationalList struct {
			field.RelationField
		}
	}
}

func (a operationBelongsToOperationalList) Where(conds ...field.Expr) *operationBelongsToOperationalList {
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

func (a operationBelongsToOperationalList) WithContext(ctx context.Context) *operationBelongsToOperationalList {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a operationBelongsToOperationalList) Session(session *gorm.Session) *operationBelongsToOperationalList {
	a.db = a.db.Session(session)
	return &a
}

func (a operationBelongsToOperationalList) Model(m *models.Operation) *operationBelongsToOperationalListTx {
	return &operationBelongsToOperationalListTx{a.db.Model(m).Association(a.Name())}
}

type operationBelongsToOperationalListTx struct{ tx *gorm.Association }

func (a operationBelongsToOperationalListTx) Find() (result *models.OperationalList, err error) {
	return result, a.tx.Find(&result)
}

func (a operationBelongsToOperationalListTx) Append(values ...*models.OperationalList) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a operationBelongsToOperationalListTx) Replace(values ...*models.OperationalList) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a operationBelongsToOperationalListTx) Delete(values ...*models.OperationalList) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a operationBelongsToOperationalListTx) Clear() error {
	return a.tx.Clear()
}

func (a operationBelongsToOperationalListTx) Count() int64 {
	return a.tx.Count()
}

type operationDo struct{ gen.DO }

type IOperationDo interface {
	gen.SubQuery
	Debug() IOperationDo
	WithContext(ctx context.Context) IOperationDo
	WithResult(fc func(tx gen.Dao)) gen.ResultInfo
	ReplaceDB(db *gorm.DB)
	ReadDB() IOperationDo
	WriteDB() IOperationDo
	As(alias string) gen.Dao
	Session(config *gorm.Session) IOperationDo
	Columns(cols ...field.Expr) gen.Columns
	Clauses(conds ...clause.Expression) IOperationDo
	Not(conds ...gen.Condition) IOperationDo
	Or(conds ...gen.Condition) IOperationDo
	Select(conds ...field.Expr) IOperationDo
	Where(conds ...gen.Condition) IOperationDo
	Order(conds ...field.Expr) IOperationDo
	Distinct(cols ...field.Expr) IOperationDo
	Omit(cols ...field.Expr) IOperationDo
	Join(table schema.Tabler, on ...field.Expr) IOperationDo
	LeftJoin(table schema.Tabler, on ...field.Expr) IOperationDo
	RightJoin(table schema.Tabler, on ...field.Expr) IOperationDo
	Group(cols ...field.Expr) IOperationDo
	Having(conds ...gen.Condition) IOperationDo
	Limit(limit int) IOperationDo
	Offset(offset int) IOperationDo
	Count() (count int64, err error)
	Scopes(funcs ...func(gen.Dao) gen.Dao) IOperationDo
	Unscoped() IOperationDo
	Create(values ...*models.Operation) error
	CreateInBatches(values []*models.Operation, batchSize int) error
	Save(values ...*models.Operation) error
	First() (*models.Operation, error)
	Take() (*models.Operation, error)
	Last() (*models.Operation, error)
	Find() ([]*models.Operation, error)
	FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.Operation, err error)
	FindInBatches(result *[]*models.Operation, batchSize int, fc func(tx gen.Dao, batch int) error) error
	Pluck(column field.Expr, dest interface{}) error
	Delete(...*models.Operation) (info gen.ResultInfo, err error)
	Update(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	Updates(value interface{}) (info gen.ResultInfo, err error)
	UpdateColumn(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateColumnSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	UpdateColumns(value interface{}) (info gen.ResultInfo, err error)
	UpdateFrom(q gen.SubQuery) gen.Dao
	Attrs(attrs ...field.AssignExpr) IOperationDo
	Assign(attrs ...field.AssignExpr) IOperationDo
	Joins(fields ...field.RelationField) IOperationDo
	Preload(fields ...field.RelationField) IOperationDo
	FirstOrInit() (*models.Operation, error)
	FirstOrCreate() (*models.Operation, error)
	FindByPage(offset int, limit int) (result []*models.Operation, count int64, err error)
	ScanByPage(result interface{}, offset int, limit int) (count int64, err error)
	Scan(result interface{}) (err error)
	Returning(value interface{}, columns ...string) IOperationDo
	UnderlyingDB() *gorm.DB
	schema.Tabler
}

func (o operationDo) Debug() IOperationDo {
	return o.withDO(o.DO.Debug())
}

func (o operationDo) WithContext(ctx context.Context) IOperationDo {
	return o.withDO(o.DO.WithContext(ctx))
}

func (o operationDo) ReadDB() IOperationDo {
	return o.Clauses(dbresolver.Read)
}

func (o operationDo) WriteDB() IOperationDo {
	return o.Clauses(dbresolver.Write)
}

func (o operationDo) Session(config *gorm.Session) IOperationDo {
	return o.withDO(o.DO.Session(config))
}

func (o operationDo) Clauses(conds ...clause.Expression) IOperationDo {
	return o.withDO(o.DO.Clauses(conds...))
}

func (o operationDo) Returning(value interface{}, columns ...string) IOperationDo {
	return o.withDO(o.DO.Returning(value, columns...))
}

func (o operationDo) Not(conds ...gen.Condition) IOperationDo {
	return o.withDO(o.DO.Not(conds...))
}

func (o operationDo) Or(conds ...gen.Condition) IOperationDo {
	return o.withDO(o.DO.Or(conds...))
}

func (o operationDo) Select(conds ...field.Expr) IOperationDo {
	return o.withDO(o.DO.Select(conds...))
}

func (o operationDo) Where(conds ...gen.Condition) IOperationDo {
	return o.withDO(o.DO.Where(conds...))
}

func (o operationDo) Order(conds ...field.Expr) IOperationDo {
	return o.withDO(o.DO.Order(conds...))
}

func (o operationDo) Distinct(cols ...field.Expr) IOperationDo {
	return o.withDO(o.DO.Distinct(cols...))
}

func (o operationDo) Omit(cols ...field.Expr) IOperationDo {
	return o.withDO(o.DO.Omit(cols...))
}

func (o operationDo) Join(table schema.Tabler, on ...field.Expr) IOperationDo {
	return o.withDO(o.DO.Join(table, on...))
}

func (o operationDo) LeftJoin(table schema.Tabler, on ...field.Expr) IOperationDo {
	return o.withDO(o.DO.LeftJoin(table, on...))
}

func (o operationDo) RightJoin(table schema.Tabler, on ...field.Expr) IOperationDo {
	return o.withDO(o.DO.RightJoin(table, on...))
}

func (o operationDo) Group(cols ...field.Expr) IOperationDo {
	return o.withDO(o.DO.Group(cols...))
}

func (o operationDo) Having(conds ...gen.Condition) IOperationDo {
	return o.withDO(o.DO.Having(conds...))
}

func (o operationDo) Limit(limit int) IOperationDo {
	return o.withDO(o.DO.Limit(limit))
}

func (o operationDo) Offset(offset int) IOperationDo {
	return o.withDO(o.DO.Offset(offset))
}

func (o operationDo) Scopes(funcs ...func(gen.Dao) gen.Dao) IOperationDo {
	return o.withDO(o.DO.Scopes(funcs...))
}

func (o operationDo) Unscoped() IOperationDo {
	return o.withDO(o.DO.Unscoped())
}

func (o operationDo) Create(values ...*models.Operation) error {
	if len(values) == 0 {
		return nil
	}
	return o.DO.Create(values)
}

func (o operationDo) CreateInBatches(values []*models.Operation, batchSize int) error {
	return o.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (o operationDo) Save(values ...*models.Operation) error {
	if len(values) == 0 {
		return nil
	}
	return o.DO.Save(values)
}

func (o operationDo) First() (*models.Operation, error) {
	if result, err := o.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*models.Operation), nil
	}
}

func (o operationDo) Take() (*models.Operation, error) {
	if result, err := o.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*models.Operation), nil
	}
}

func (o operationDo) Last() (*models.Operation, error) {
	if result, err := o.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*models.Operation), nil
	}
}

func (o operationDo) Find() ([]*models.Operation, error) {
	result, err := o.DO.Find()
	return result.([]*models.Operation), err
}

func (o operationDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.Operation, err error) {
	buf := make([]*models.Operation, 0, batchSize)
	err = o.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (o operationDo) FindInBatches(result *[]*models.Operation, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return o.DO.FindInBatches(result, batchSize, fc)
}

func (o operationDo) Attrs(attrs ...field.AssignExpr) IOperationDo {
	return o.withDO(o.DO.Attrs(attrs...))
}

func (o operationDo) Assign(attrs ...field.AssignExpr) IOperationDo {
	return o.withDO(o.DO.Assign(attrs...))
}

func (o operationDo) Joins(fields ...field.RelationField) IOperationDo {
	for _, _f := range fields {
		o = *o.withDO(o.DO.Joins(_f))
	}
	return &o
}

func (o operationDo) Preload(fields ...field.RelationField) IOperationDo {
	for _, _f := range fields {
		o = *o.withDO(o.DO.Preload(_f))
	}
	return &o
}

func (o operationDo) FirstOrInit() (*models.Operation, error) {
	if result, err := o.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*models.Operation), nil
	}
}

func (o operationDo) FirstOrCreate() (*models.Operation, error) {
	if result, err := o.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*models.Operation), nil
	}
}

func (o operationDo) FindByPage(offset int, limit int) (result []*models.Operation, count int64, err error) {
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

func (o operationDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = o.Count()
	if err != nil {
		return
	}

	err = o.Offset(offset).Limit(limit).Scan(result)
	return
}

func (o operationDo) Scan(result interface{}) (err error) {
	return o.DO.Scan(result)
}

func (o operationDo) Delete(models ...*models.Operation) (result gen.ResultInfo, err error) {
	return o.DO.Delete(models)
}

func (o *operationDo) withDO(do gen.Dao) *operationDo {
	o.DO = *do.(*gen.DO)
	return o
}
