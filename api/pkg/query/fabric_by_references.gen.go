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

func newFabricByReference(db *gorm.DB, opts ...gen.DOOption) fabricByReference {
	_fabricByReference := fabricByReference{}

	_fabricByReference.fabricByReferenceDo.UseDB(db, opts...)
	_fabricByReference.fabricByReferenceDo.UseModel(&models.FabricByReference{})

	tableName := _fabricByReference.fabricByReferenceDo.TableName()
	_fabricByReference.ALL = field.NewAsterisk(tableName)
	_fabricByReference.ID = field.NewUint(tableName, "id")
	_fabricByReference.Key = field.NewString(tableName, "key")
	_fabricByReference.ColorByReferenceID = field.NewUint(tableName, "color_by_reference_id")
	_fabricByReference.DeletedAt = field.NewField(tableName, "deleted_at")
	_fabricByReference.FabricId = field.NewUint(tableName, "fabric_id")
	_fabricByReference.XS2 = field.NewFloat64(tableName, "xs2")
	_fabricByReference.XS = field.NewFloat64(tableName, "xs")
	_fabricByReference.S = field.NewFloat64(tableName, "s")
	_fabricByReference.M = field.NewFloat64(tableName, "m")
	_fabricByReference.L = field.NewFloat64(tableName, "l")
	_fabricByReference.XL = field.NewFloat64(tableName, "xl")
	_fabricByReference.XL2 = field.NewFloat64(tableName, "xl2")
	_fabricByReference.XL3 = field.NewFloat64(tableName, "xl3")
	_fabricByReference.XL4 = field.NewFloat64(tableName, "xl4")
	_fabricByReference.XL5 = field.NewFloat64(tableName, "xl5")
	_fabricByReference.XL6 = field.NewFloat64(tableName, "xl6")
	_fabricByReference.XL7 = field.NewFloat64(tableName, "xl7")
	_fabricByReference.XL8 = field.NewFloat64(tableName, "xl8")
	_fabricByReference.ColorByReference = fabricByReferenceBelongsToColorByReference{
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
		},
	}

	_fabricByReference.Fabric = fabricByReferenceBelongsToFabric{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Fabric", "models.Fabric"),
		Color: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Fabric.Color", "models.Color"),
		},
	}

	_fabricByReference.fillFieldMap()

	return _fabricByReference
}

type fabricByReference struct {
	fabricByReferenceDo

	ALL                field.Asterisk
	ID                 field.Uint
	Key                field.String
	ColorByReferenceID field.Uint
	DeletedAt          field.Field
	FabricId           field.Uint
	XS2                field.Float64
	XS                 field.Float64
	S                  field.Float64
	M                  field.Float64
	L                  field.Float64
	XL                 field.Float64
	XL2                field.Float64
	XL3                field.Float64
	XL4                field.Float64
	XL5                field.Float64
	XL6                field.Float64
	XL7                field.Float64
	XL8                field.Float64
	ColorByReference   fabricByReferenceBelongsToColorByReference

	Fabric fabricByReferenceBelongsToFabric

	fieldMap map[string]field.Expr
}

func (f fabricByReference) Table(newTableName string) *fabricByReference {
	f.fabricByReferenceDo.UseTable(newTableName)
	return f.updateTableName(newTableName)
}

func (f fabricByReference) As(alias string) *fabricByReference {
	f.fabricByReferenceDo.DO = *(f.fabricByReferenceDo.As(alias).(*gen.DO))
	return f.updateTableName(alias)
}

func (f *fabricByReference) updateTableName(table string) *fabricByReference {
	f.ALL = field.NewAsterisk(table)
	f.ID = field.NewUint(table, "id")
	f.Key = field.NewString(table, "key")
	f.ColorByReferenceID = field.NewUint(table, "color_by_reference_id")
	f.DeletedAt = field.NewField(table, "deleted_at")
	f.FabricId = field.NewUint(table, "fabric_id")
	f.XS2 = field.NewFloat64(table, "xs2")
	f.XS = field.NewFloat64(table, "xs")
	f.S = field.NewFloat64(table, "s")
	f.M = field.NewFloat64(table, "m")
	f.L = field.NewFloat64(table, "l")
	f.XL = field.NewFloat64(table, "xl")
	f.XL2 = field.NewFloat64(table, "xl2")
	f.XL3 = field.NewFloat64(table, "xl3")
	f.XL4 = field.NewFloat64(table, "xl4")
	f.XL5 = field.NewFloat64(table, "xl5")
	f.XL6 = field.NewFloat64(table, "xl6")
	f.XL7 = field.NewFloat64(table, "xl7")
	f.XL8 = field.NewFloat64(table, "xl8")

	f.fillFieldMap()

	return f
}

func (f *fabricByReference) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := f.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (f *fabricByReference) fillFieldMap() {
	f.fieldMap = make(map[string]field.Expr, 20)
	f.fieldMap["id"] = f.ID
	f.fieldMap["key"] = f.Key
	f.fieldMap["color_by_reference_id"] = f.ColorByReferenceID
	f.fieldMap["deleted_at"] = f.DeletedAt
	f.fieldMap["fabric_id"] = f.FabricId
	f.fieldMap["xs2"] = f.XS2
	f.fieldMap["xs"] = f.XS
	f.fieldMap["s"] = f.S
	f.fieldMap["m"] = f.M
	f.fieldMap["l"] = f.L
	f.fieldMap["xl"] = f.XL
	f.fieldMap["xl2"] = f.XL2
	f.fieldMap["xl3"] = f.XL3
	f.fieldMap["xl4"] = f.XL4
	f.fieldMap["xl5"] = f.XL5
	f.fieldMap["xl6"] = f.XL6
	f.fieldMap["xl7"] = f.XL7
	f.fieldMap["xl8"] = f.XL8

}

func (f fabricByReference) clone(db *gorm.DB) fabricByReference {
	f.fabricByReferenceDo.ReplaceConnPool(db.Statement.ConnPool)
	return f
}

func (f fabricByReference) replaceDB(db *gorm.DB) fabricByReference {
	f.fabricByReferenceDo.ReplaceDB(db)
	return f
}

type fabricByReferenceBelongsToColorByReference struct {
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
	}
}

func (a fabricByReferenceBelongsToColorByReference) Where(conds ...field.Expr) *fabricByReferenceBelongsToColorByReference {
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

func (a fabricByReferenceBelongsToColorByReference) WithContext(ctx context.Context) *fabricByReferenceBelongsToColorByReference {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a fabricByReferenceBelongsToColorByReference) Session(session *gorm.Session) *fabricByReferenceBelongsToColorByReference {
	a.db = a.db.Session(session)
	return &a
}

func (a fabricByReferenceBelongsToColorByReference) Model(m *models.FabricByReference) *fabricByReferenceBelongsToColorByReferenceTx {
	return &fabricByReferenceBelongsToColorByReferenceTx{a.db.Model(m).Association(a.Name())}
}

type fabricByReferenceBelongsToColorByReferenceTx struct{ tx *gorm.Association }

func (a fabricByReferenceBelongsToColorByReferenceTx) Find() (result *models.ColorByReference, err error) {
	return result, a.tx.Find(&result)
}

func (a fabricByReferenceBelongsToColorByReferenceTx) Append(values ...*models.ColorByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a fabricByReferenceBelongsToColorByReferenceTx) Replace(values ...*models.ColorByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a fabricByReferenceBelongsToColorByReferenceTx) Delete(values ...*models.ColorByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a fabricByReferenceBelongsToColorByReferenceTx) Clear() error {
	return a.tx.Clear()
}

func (a fabricByReferenceBelongsToColorByReferenceTx) Count() int64 {
	return a.tx.Count()
}

type fabricByReferenceBelongsToFabric struct {
	db *gorm.DB

	field.RelationField

	Color struct {
		field.RelationField
	}
}

func (a fabricByReferenceBelongsToFabric) Where(conds ...field.Expr) *fabricByReferenceBelongsToFabric {
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

func (a fabricByReferenceBelongsToFabric) WithContext(ctx context.Context) *fabricByReferenceBelongsToFabric {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a fabricByReferenceBelongsToFabric) Session(session *gorm.Session) *fabricByReferenceBelongsToFabric {
	a.db = a.db.Session(session)
	return &a
}

func (a fabricByReferenceBelongsToFabric) Model(m *models.FabricByReference) *fabricByReferenceBelongsToFabricTx {
	return &fabricByReferenceBelongsToFabricTx{a.db.Model(m).Association(a.Name())}
}

type fabricByReferenceBelongsToFabricTx struct{ tx *gorm.Association }

func (a fabricByReferenceBelongsToFabricTx) Find() (result *models.Fabric, err error) {
	return result, a.tx.Find(&result)
}

func (a fabricByReferenceBelongsToFabricTx) Append(values ...*models.Fabric) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a fabricByReferenceBelongsToFabricTx) Replace(values ...*models.Fabric) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a fabricByReferenceBelongsToFabricTx) Delete(values ...*models.Fabric) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a fabricByReferenceBelongsToFabricTx) Clear() error {
	return a.tx.Clear()
}

func (a fabricByReferenceBelongsToFabricTx) Count() int64 {
	return a.tx.Count()
}

type fabricByReferenceDo struct{ gen.DO }

type IFabricByReferenceDo interface {
	gen.SubQuery
	Debug() IFabricByReferenceDo
	WithContext(ctx context.Context) IFabricByReferenceDo
	WithResult(fc func(tx gen.Dao)) gen.ResultInfo
	ReplaceDB(db *gorm.DB)
	ReadDB() IFabricByReferenceDo
	WriteDB() IFabricByReferenceDo
	As(alias string) gen.Dao
	Session(config *gorm.Session) IFabricByReferenceDo
	Columns(cols ...field.Expr) gen.Columns
	Clauses(conds ...clause.Expression) IFabricByReferenceDo
	Not(conds ...gen.Condition) IFabricByReferenceDo
	Or(conds ...gen.Condition) IFabricByReferenceDo
	Select(conds ...field.Expr) IFabricByReferenceDo
	Where(conds ...gen.Condition) IFabricByReferenceDo
	Order(conds ...field.Expr) IFabricByReferenceDo
	Distinct(cols ...field.Expr) IFabricByReferenceDo
	Omit(cols ...field.Expr) IFabricByReferenceDo
	Join(table schema.Tabler, on ...field.Expr) IFabricByReferenceDo
	LeftJoin(table schema.Tabler, on ...field.Expr) IFabricByReferenceDo
	RightJoin(table schema.Tabler, on ...field.Expr) IFabricByReferenceDo
	Group(cols ...field.Expr) IFabricByReferenceDo
	Having(conds ...gen.Condition) IFabricByReferenceDo
	Limit(limit int) IFabricByReferenceDo
	Offset(offset int) IFabricByReferenceDo
	Count() (count int64, err error)
	Scopes(funcs ...func(gen.Dao) gen.Dao) IFabricByReferenceDo
	Unscoped() IFabricByReferenceDo
	Create(values ...*models.FabricByReference) error
	CreateInBatches(values []*models.FabricByReference, batchSize int) error
	Save(values ...*models.FabricByReference) error
	First() (*models.FabricByReference, error)
	Take() (*models.FabricByReference, error)
	Last() (*models.FabricByReference, error)
	Find() ([]*models.FabricByReference, error)
	FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.FabricByReference, err error)
	FindInBatches(result *[]*models.FabricByReference, batchSize int, fc func(tx gen.Dao, batch int) error) error
	Pluck(column field.Expr, dest interface{}) error
	Delete(...*models.FabricByReference) (info gen.ResultInfo, err error)
	Update(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	Updates(value interface{}) (info gen.ResultInfo, err error)
	UpdateColumn(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateColumnSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	UpdateColumns(value interface{}) (info gen.ResultInfo, err error)
	UpdateFrom(q gen.SubQuery) gen.Dao
	Attrs(attrs ...field.AssignExpr) IFabricByReferenceDo
	Assign(attrs ...field.AssignExpr) IFabricByReferenceDo
	Joins(fields ...field.RelationField) IFabricByReferenceDo
	Preload(fields ...field.RelationField) IFabricByReferenceDo
	FirstOrInit() (*models.FabricByReference, error)
	FirstOrCreate() (*models.FabricByReference, error)
	FindByPage(offset int, limit int) (result []*models.FabricByReference, count int64, err error)
	ScanByPage(result interface{}, offset int, limit int) (count int64, err error)
	Scan(result interface{}) (err error)
	Returning(value interface{}, columns ...string) IFabricByReferenceDo
	UnderlyingDB() *gorm.DB
	schema.Tabler
}

func (f fabricByReferenceDo) Debug() IFabricByReferenceDo {
	return f.withDO(f.DO.Debug())
}

func (f fabricByReferenceDo) WithContext(ctx context.Context) IFabricByReferenceDo {
	return f.withDO(f.DO.WithContext(ctx))
}

func (f fabricByReferenceDo) ReadDB() IFabricByReferenceDo {
	return f.Clauses(dbresolver.Read)
}

func (f fabricByReferenceDo) WriteDB() IFabricByReferenceDo {
	return f.Clauses(dbresolver.Write)
}

func (f fabricByReferenceDo) Session(config *gorm.Session) IFabricByReferenceDo {
	return f.withDO(f.DO.Session(config))
}

func (f fabricByReferenceDo) Clauses(conds ...clause.Expression) IFabricByReferenceDo {
	return f.withDO(f.DO.Clauses(conds...))
}

func (f fabricByReferenceDo) Returning(value interface{}, columns ...string) IFabricByReferenceDo {
	return f.withDO(f.DO.Returning(value, columns...))
}

func (f fabricByReferenceDo) Not(conds ...gen.Condition) IFabricByReferenceDo {
	return f.withDO(f.DO.Not(conds...))
}

func (f fabricByReferenceDo) Or(conds ...gen.Condition) IFabricByReferenceDo {
	return f.withDO(f.DO.Or(conds...))
}

func (f fabricByReferenceDo) Select(conds ...field.Expr) IFabricByReferenceDo {
	return f.withDO(f.DO.Select(conds...))
}

func (f fabricByReferenceDo) Where(conds ...gen.Condition) IFabricByReferenceDo {
	return f.withDO(f.DO.Where(conds...))
}

func (f fabricByReferenceDo) Order(conds ...field.Expr) IFabricByReferenceDo {
	return f.withDO(f.DO.Order(conds...))
}

func (f fabricByReferenceDo) Distinct(cols ...field.Expr) IFabricByReferenceDo {
	return f.withDO(f.DO.Distinct(cols...))
}

func (f fabricByReferenceDo) Omit(cols ...field.Expr) IFabricByReferenceDo {
	return f.withDO(f.DO.Omit(cols...))
}

func (f fabricByReferenceDo) Join(table schema.Tabler, on ...field.Expr) IFabricByReferenceDo {
	return f.withDO(f.DO.Join(table, on...))
}

func (f fabricByReferenceDo) LeftJoin(table schema.Tabler, on ...field.Expr) IFabricByReferenceDo {
	return f.withDO(f.DO.LeftJoin(table, on...))
}

func (f fabricByReferenceDo) RightJoin(table schema.Tabler, on ...field.Expr) IFabricByReferenceDo {
	return f.withDO(f.DO.RightJoin(table, on...))
}

func (f fabricByReferenceDo) Group(cols ...field.Expr) IFabricByReferenceDo {
	return f.withDO(f.DO.Group(cols...))
}

func (f fabricByReferenceDo) Having(conds ...gen.Condition) IFabricByReferenceDo {
	return f.withDO(f.DO.Having(conds...))
}

func (f fabricByReferenceDo) Limit(limit int) IFabricByReferenceDo {
	return f.withDO(f.DO.Limit(limit))
}

func (f fabricByReferenceDo) Offset(offset int) IFabricByReferenceDo {
	return f.withDO(f.DO.Offset(offset))
}

func (f fabricByReferenceDo) Scopes(funcs ...func(gen.Dao) gen.Dao) IFabricByReferenceDo {
	return f.withDO(f.DO.Scopes(funcs...))
}

func (f fabricByReferenceDo) Unscoped() IFabricByReferenceDo {
	return f.withDO(f.DO.Unscoped())
}

func (f fabricByReferenceDo) Create(values ...*models.FabricByReference) error {
	if len(values) == 0 {
		return nil
	}
	return f.DO.Create(values)
}

func (f fabricByReferenceDo) CreateInBatches(values []*models.FabricByReference, batchSize int) error {
	return f.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (f fabricByReferenceDo) Save(values ...*models.FabricByReference) error {
	if len(values) == 0 {
		return nil
	}
	return f.DO.Save(values)
}

func (f fabricByReferenceDo) First() (*models.FabricByReference, error) {
	if result, err := f.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*models.FabricByReference), nil
	}
}

func (f fabricByReferenceDo) Take() (*models.FabricByReference, error) {
	if result, err := f.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*models.FabricByReference), nil
	}
}

func (f fabricByReferenceDo) Last() (*models.FabricByReference, error) {
	if result, err := f.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*models.FabricByReference), nil
	}
}

func (f fabricByReferenceDo) Find() ([]*models.FabricByReference, error) {
	result, err := f.DO.Find()
	return result.([]*models.FabricByReference), err
}

func (f fabricByReferenceDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.FabricByReference, err error) {
	buf := make([]*models.FabricByReference, 0, batchSize)
	err = f.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (f fabricByReferenceDo) FindInBatches(result *[]*models.FabricByReference, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return f.DO.FindInBatches(result, batchSize, fc)
}

func (f fabricByReferenceDo) Attrs(attrs ...field.AssignExpr) IFabricByReferenceDo {
	return f.withDO(f.DO.Attrs(attrs...))
}

func (f fabricByReferenceDo) Assign(attrs ...field.AssignExpr) IFabricByReferenceDo {
	return f.withDO(f.DO.Assign(attrs...))
}

func (f fabricByReferenceDo) Joins(fields ...field.RelationField) IFabricByReferenceDo {
	for _, _f := range fields {
		f = *f.withDO(f.DO.Joins(_f))
	}
	return &f
}

func (f fabricByReferenceDo) Preload(fields ...field.RelationField) IFabricByReferenceDo {
	for _, _f := range fields {
		f = *f.withDO(f.DO.Preload(_f))
	}
	return &f
}

func (f fabricByReferenceDo) FirstOrInit() (*models.FabricByReference, error) {
	if result, err := f.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*models.FabricByReference), nil
	}
}

func (f fabricByReferenceDo) FirstOrCreate() (*models.FabricByReference, error) {
	if result, err := f.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*models.FabricByReference), nil
	}
}

func (f fabricByReferenceDo) FindByPage(offset int, limit int) (result []*models.FabricByReference, count int64, err error) {
	result, err = f.Offset(offset).Limit(limit).Find()
	if err != nil {
		return
	}

	if size := len(result); 0 < limit && 0 < size && size < limit {
		count = int64(size + offset)
		return
	}

	count, err = f.Offset(-1).Limit(-1).Count()
	return
}

func (f fabricByReferenceDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = f.Count()
	if err != nil {
		return
	}

	err = f.Offset(offset).Limit(limit).Scan(result)
	return
}

func (f fabricByReferenceDo) Scan(result interface{}) (err error) {
	return f.DO.Scan(result)
}

func (f fabricByReferenceDo) Delete(models ...*models.FabricByReference) (result gen.ResultInfo, err error) {
	return f.DO.Delete(models)
}

func (f *fabricByReferenceDo) withDO(do gen.Dao) *fabricByReferenceDo {
	f.DO = *do.(*gen.DO)
	return f
}
