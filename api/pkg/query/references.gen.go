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

func newReference(db *gorm.DB, opts ...gen.DOOption) reference {
	_reference := reference{}

	_reference.referenceDo.UseDB(db, opts...)
	_reference.referenceDo.UseModel(&models.Reference{})

	tableName := _reference.referenceDo.TableName()
	_reference.ALL = field.NewAsterisk(tableName)
	_reference.ID = field.NewUint(tableName, "id")
	_reference.Code = field.NewString(tableName, "code")
	_reference.CreatedAt = field.NewTime(tableName, "created_at")
	_reference.DeletedAt = field.NewField(tableName, "deleted_at")
	_reference.CreatedBy = field.NewString(tableName, "created_by")
	_reference.Front = field.NewString(tableName, "front")
	_reference.Back = field.NewString(tableName, "back")
	_reference.Colors = referenceHasManyColors{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Colors", "models.ColorByReference"),
		Color: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Colors.Color", "models.Color"),
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
			RelationField: field.NewRelation("Colors.Resources", "models.ResourceByReference"),
			Resource: struct {
				field.RelationField
				Color struct {
					field.RelationField
				}
				Supplier struct {
					field.RelationField
				}
			}{
				RelationField: field.NewRelation("Colors.Resources.Resource", "models.Resource"),
				Color: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Colors.Resources.Resource.Color", "models.Color"),
				},
				Supplier: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Colors.Resources.Resource.Supplier", "models.Supplier"),
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
			RelationField: field.NewRelation("Colors.Fabrics", "models.FabricByReference"),
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
				RelationField: field.NewRelation("Colors.Fabrics.Fabric", "models.Fabric"),
				Color: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Colors.Fabrics.Fabric.Color", "models.Color"),
				},
				Supplier: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Colors.Fabrics.Fabric.Supplier", "models.Supplier"),
				},
				Composition: struct {
					field.RelationField
				}{
					RelationField: field.NewRelation("Colors.Fabrics.Fabric.Composition", "models.Composition"),
				},
			},
		},
	}

	_reference.User = referenceBelongsToUser{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("User", "models.User"),
	}

	_reference.FrontImage = referenceBelongsToFrontImage{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("FrontImage", "models.Image"),
	}

	_reference.BackImage = referenceBelongsToBackImage{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("BackImage", "models.Image"),
	}

	_reference.fillFieldMap()

	return _reference
}

type reference struct {
	referenceDo

	ALL       field.Asterisk
	ID        field.Uint
	Code      field.String
	CreatedAt field.Time
	DeletedAt field.Field
	CreatedBy field.String
	Front     field.String
	Back      field.String
	Colors    referenceHasManyColors

	User referenceBelongsToUser

	FrontImage referenceBelongsToFrontImage

	BackImage referenceBelongsToBackImage

	fieldMap map[string]field.Expr
}

func (r reference) Table(newTableName string) *reference {
	r.referenceDo.UseTable(newTableName)
	return r.updateTableName(newTableName)
}

func (r reference) As(alias string) *reference {
	r.referenceDo.DO = *(r.referenceDo.As(alias).(*gen.DO))
	return r.updateTableName(alias)
}

func (r *reference) updateTableName(table string) *reference {
	r.ALL = field.NewAsterisk(table)
	r.ID = field.NewUint(table, "id")
	r.Code = field.NewString(table, "code")
	r.CreatedAt = field.NewTime(table, "created_at")
	r.DeletedAt = field.NewField(table, "deleted_at")
	r.CreatedBy = field.NewString(table, "created_by")
	r.Front = field.NewString(table, "front")
	r.Back = field.NewString(table, "back")

	r.fillFieldMap()

	return r
}

func (r *reference) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := r.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (r *reference) fillFieldMap() {
	r.fieldMap = make(map[string]field.Expr, 11)
	r.fieldMap["id"] = r.ID
	r.fieldMap["code"] = r.Code
	r.fieldMap["created_at"] = r.CreatedAt
	r.fieldMap["deleted_at"] = r.DeletedAt
	r.fieldMap["created_by"] = r.CreatedBy
	r.fieldMap["front"] = r.Front
	r.fieldMap["back"] = r.Back

}

func (r reference) clone(db *gorm.DB) reference {
	r.referenceDo.ReplaceConnPool(db.Statement.ConnPool)
	return r
}

func (r reference) replaceDB(db *gorm.DB) reference {
	r.referenceDo.ReplaceDB(db)
	return r
}

type referenceHasManyColors struct {
	db *gorm.DB

	field.RelationField

	Color struct {
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

func (a referenceHasManyColors) Where(conds ...field.Expr) *referenceHasManyColors {
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

func (a referenceHasManyColors) WithContext(ctx context.Context) *referenceHasManyColors {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a referenceHasManyColors) Session(session *gorm.Session) *referenceHasManyColors {
	a.db = a.db.Session(session)
	return &a
}

func (a referenceHasManyColors) Model(m *models.Reference) *referenceHasManyColorsTx {
	return &referenceHasManyColorsTx{a.db.Model(m).Association(a.Name())}
}

type referenceHasManyColorsTx struct{ tx *gorm.Association }

func (a referenceHasManyColorsTx) Find() (result []*models.ColorByReference, err error) {
	return result, a.tx.Find(&result)
}

func (a referenceHasManyColorsTx) Append(values ...*models.ColorByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a referenceHasManyColorsTx) Replace(values ...*models.ColorByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a referenceHasManyColorsTx) Delete(values ...*models.ColorByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a referenceHasManyColorsTx) Clear() error {
	return a.tx.Clear()
}

func (a referenceHasManyColorsTx) Count() int64 {
	return a.tx.Count()
}

type referenceBelongsToUser struct {
	db *gorm.DB

	field.RelationField
}

func (a referenceBelongsToUser) Where(conds ...field.Expr) *referenceBelongsToUser {
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

func (a referenceBelongsToUser) WithContext(ctx context.Context) *referenceBelongsToUser {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a referenceBelongsToUser) Session(session *gorm.Session) *referenceBelongsToUser {
	a.db = a.db.Session(session)
	return &a
}

func (a referenceBelongsToUser) Model(m *models.Reference) *referenceBelongsToUserTx {
	return &referenceBelongsToUserTx{a.db.Model(m).Association(a.Name())}
}

type referenceBelongsToUserTx struct{ tx *gorm.Association }

func (a referenceBelongsToUserTx) Find() (result *models.User, err error) {
	return result, a.tx.Find(&result)
}

func (a referenceBelongsToUserTx) Append(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a referenceBelongsToUserTx) Replace(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a referenceBelongsToUserTx) Delete(values ...*models.User) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a referenceBelongsToUserTx) Clear() error {
	return a.tx.Clear()
}

func (a referenceBelongsToUserTx) Count() int64 {
	return a.tx.Count()
}

type referenceBelongsToFrontImage struct {
	db *gorm.DB

	field.RelationField
}

func (a referenceBelongsToFrontImage) Where(conds ...field.Expr) *referenceBelongsToFrontImage {
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

func (a referenceBelongsToFrontImage) WithContext(ctx context.Context) *referenceBelongsToFrontImage {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a referenceBelongsToFrontImage) Session(session *gorm.Session) *referenceBelongsToFrontImage {
	a.db = a.db.Session(session)
	return &a
}

func (a referenceBelongsToFrontImage) Model(m *models.Reference) *referenceBelongsToFrontImageTx {
	return &referenceBelongsToFrontImageTx{a.db.Model(m).Association(a.Name())}
}

type referenceBelongsToFrontImageTx struct{ tx *gorm.Association }

func (a referenceBelongsToFrontImageTx) Find() (result *models.Image, err error) {
	return result, a.tx.Find(&result)
}

func (a referenceBelongsToFrontImageTx) Append(values ...*models.Image) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a referenceBelongsToFrontImageTx) Replace(values ...*models.Image) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a referenceBelongsToFrontImageTx) Delete(values ...*models.Image) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a referenceBelongsToFrontImageTx) Clear() error {
	return a.tx.Clear()
}

func (a referenceBelongsToFrontImageTx) Count() int64 {
	return a.tx.Count()
}

type referenceBelongsToBackImage struct {
	db *gorm.DB

	field.RelationField
}

func (a referenceBelongsToBackImage) Where(conds ...field.Expr) *referenceBelongsToBackImage {
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

func (a referenceBelongsToBackImage) WithContext(ctx context.Context) *referenceBelongsToBackImage {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a referenceBelongsToBackImage) Session(session *gorm.Session) *referenceBelongsToBackImage {
	a.db = a.db.Session(session)
	return &a
}

func (a referenceBelongsToBackImage) Model(m *models.Reference) *referenceBelongsToBackImageTx {
	return &referenceBelongsToBackImageTx{a.db.Model(m).Association(a.Name())}
}

type referenceBelongsToBackImageTx struct{ tx *gorm.Association }

func (a referenceBelongsToBackImageTx) Find() (result *models.Image, err error) {
	return result, a.tx.Find(&result)
}

func (a referenceBelongsToBackImageTx) Append(values ...*models.Image) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a referenceBelongsToBackImageTx) Replace(values ...*models.Image) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a referenceBelongsToBackImageTx) Delete(values ...*models.Image) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a referenceBelongsToBackImageTx) Clear() error {
	return a.tx.Clear()
}

func (a referenceBelongsToBackImageTx) Count() int64 {
	return a.tx.Count()
}

type referenceDo struct{ gen.DO }

type IReferenceDo interface {
	gen.SubQuery
	Debug() IReferenceDo
	WithContext(ctx context.Context) IReferenceDo
	WithResult(fc func(tx gen.Dao)) gen.ResultInfo
	ReplaceDB(db *gorm.DB)
	ReadDB() IReferenceDo
	WriteDB() IReferenceDo
	As(alias string) gen.Dao
	Session(config *gorm.Session) IReferenceDo
	Columns(cols ...field.Expr) gen.Columns
	Clauses(conds ...clause.Expression) IReferenceDo
	Not(conds ...gen.Condition) IReferenceDo
	Or(conds ...gen.Condition) IReferenceDo
	Select(conds ...field.Expr) IReferenceDo
	Where(conds ...gen.Condition) IReferenceDo
	Order(conds ...field.Expr) IReferenceDo
	Distinct(cols ...field.Expr) IReferenceDo
	Omit(cols ...field.Expr) IReferenceDo
	Join(table schema.Tabler, on ...field.Expr) IReferenceDo
	LeftJoin(table schema.Tabler, on ...field.Expr) IReferenceDo
	RightJoin(table schema.Tabler, on ...field.Expr) IReferenceDo
	Group(cols ...field.Expr) IReferenceDo
	Having(conds ...gen.Condition) IReferenceDo
	Limit(limit int) IReferenceDo
	Offset(offset int) IReferenceDo
	Count() (count int64, err error)
	Scopes(funcs ...func(gen.Dao) gen.Dao) IReferenceDo
	Unscoped() IReferenceDo
	Create(values ...*models.Reference) error
	CreateInBatches(values []*models.Reference, batchSize int) error
	Save(values ...*models.Reference) error
	First() (*models.Reference, error)
	Take() (*models.Reference, error)
	Last() (*models.Reference, error)
	Find() ([]*models.Reference, error)
	FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.Reference, err error)
	FindInBatches(result *[]*models.Reference, batchSize int, fc func(tx gen.Dao, batch int) error) error
	Pluck(column field.Expr, dest interface{}) error
	Delete(...*models.Reference) (info gen.ResultInfo, err error)
	Update(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	Updates(value interface{}) (info gen.ResultInfo, err error)
	UpdateColumn(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateColumnSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	UpdateColumns(value interface{}) (info gen.ResultInfo, err error)
	UpdateFrom(q gen.SubQuery) gen.Dao
	Attrs(attrs ...field.AssignExpr) IReferenceDo
	Assign(attrs ...field.AssignExpr) IReferenceDo
	Joins(fields ...field.RelationField) IReferenceDo
	Preload(fields ...field.RelationField) IReferenceDo
	FirstOrInit() (*models.Reference, error)
	FirstOrCreate() (*models.Reference, error)
	FindByPage(offset int, limit int) (result []*models.Reference, count int64, err error)
	ScanByPage(result interface{}, offset int, limit int) (count int64, err error)
	Scan(result interface{}) (err error)
	Returning(value interface{}, columns ...string) IReferenceDo
	UnderlyingDB() *gorm.DB
	schema.Tabler
}

func (r referenceDo) Debug() IReferenceDo {
	return r.withDO(r.DO.Debug())
}

func (r referenceDo) WithContext(ctx context.Context) IReferenceDo {
	return r.withDO(r.DO.WithContext(ctx))
}

func (r referenceDo) ReadDB() IReferenceDo {
	return r.Clauses(dbresolver.Read)
}

func (r referenceDo) WriteDB() IReferenceDo {
	return r.Clauses(dbresolver.Write)
}

func (r referenceDo) Session(config *gorm.Session) IReferenceDo {
	return r.withDO(r.DO.Session(config))
}

func (r referenceDo) Clauses(conds ...clause.Expression) IReferenceDo {
	return r.withDO(r.DO.Clauses(conds...))
}

func (r referenceDo) Returning(value interface{}, columns ...string) IReferenceDo {
	return r.withDO(r.DO.Returning(value, columns...))
}

func (r referenceDo) Not(conds ...gen.Condition) IReferenceDo {
	return r.withDO(r.DO.Not(conds...))
}

func (r referenceDo) Or(conds ...gen.Condition) IReferenceDo {
	return r.withDO(r.DO.Or(conds...))
}

func (r referenceDo) Select(conds ...field.Expr) IReferenceDo {
	return r.withDO(r.DO.Select(conds...))
}

func (r referenceDo) Where(conds ...gen.Condition) IReferenceDo {
	return r.withDO(r.DO.Where(conds...))
}

func (r referenceDo) Order(conds ...field.Expr) IReferenceDo {
	return r.withDO(r.DO.Order(conds...))
}

func (r referenceDo) Distinct(cols ...field.Expr) IReferenceDo {
	return r.withDO(r.DO.Distinct(cols...))
}

func (r referenceDo) Omit(cols ...field.Expr) IReferenceDo {
	return r.withDO(r.DO.Omit(cols...))
}

func (r referenceDo) Join(table schema.Tabler, on ...field.Expr) IReferenceDo {
	return r.withDO(r.DO.Join(table, on...))
}

func (r referenceDo) LeftJoin(table schema.Tabler, on ...field.Expr) IReferenceDo {
	return r.withDO(r.DO.LeftJoin(table, on...))
}

func (r referenceDo) RightJoin(table schema.Tabler, on ...field.Expr) IReferenceDo {
	return r.withDO(r.DO.RightJoin(table, on...))
}

func (r referenceDo) Group(cols ...field.Expr) IReferenceDo {
	return r.withDO(r.DO.Group(cols...))
}

func (r referenceDo) Having(conds ...gen.Condition) IReferenceDo {
	return r.withDO(r.DO.Having(conds...))
}

func (r referenceDo) Limit(limit int) IReferenceDo {
	return r.withDO(r.DO.Limit(limit))
}

func (r referenceDo) Offset(offset int) IReferenceDo {
	return r.withDO(r.DO.Offset(offset))
}

func (r referenceDo) Scopes(funcs ...func(gen.Dao) gen.Dao) IReferenceDo {
	return r.withDO(r.DO.Scopes(funcs...))
}

func (r referenceDo) Unscoped() IReferenceDo {
	return r.withDO(r.DO.Unscoped())
}

func (r referenceDo) Create(values ...*models.Reference) error {
	if len(values) == 0 {
		return nil
	}
	return r.DO.Create(values)
}

func (r referenceDo) CreateInBatches(values []*models.Reference, batchSize int) error {
	return r.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (r referenceDo) Save(values ...*models.Reference) error {
	if len(values) == 0 {
		return nil
	}
	return r.DO.Save(values)
}

func (r referenceDo) First() (*models.Reference, error) {
	if result, err := r.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*models.Reference), nil
	}
}

func (r referenceDo) Take() (*models.Reference, error) {
	if result, err := r.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*models.Reference), nil
	}
}

func (r referenceDo) Last() (*models.Reference, error) {
	if result, err := r.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*models.Reference), nil
	}
}

func (r referenceDo) Find() ([]*models.Reference, error) {
	result, err := r.DO.Find()
	return result.([]*models.Reference), err
}

func (r referenceDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.Reference, err error) {
	buf := make([]*models.Reference, 0, batchSize)
	err = r.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (r referenceDo) FindInBatches(result *[]*models.Reference, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return r.DO.FindInBatches(result, batchSize, fc)
}

func (r referenceDo) Attrs(attrs ...field.AssignExpr) IReferenceDo {
	return r.withDO(r.DO.Attrs(attrs...))
}

func (r referenceDo) Assign(attrs ...field.AssignExpr) IReferenceDo {
	return r.withDO(r.DO.Assign(attrs...))
}

func (r referenceDo) Joins(fields ...field.RelationField) IReferenceDo {
	for _, _f := range fields {
		r = *r.withDO(r.DO.Joins(_f))
	}
	return &r
}

func (r referenceDo) Preload(fields ...field.RelationField) IReferenceDo {
	for _, _f := range fields {
		r = *r.withDO(r.DO.Preload(_f))
	}
	return &r
}

func (r referenceDo) FirstOrInit() (*models.Reference, error) {
	if result, err := r.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*models.Reference), nil
	}
}

func (r referenceDo) FirstOrCreate() (*models.Reference, error) {
	if result, err := r.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*models.Reference), nil
	}
}

func (r referenceDo) FindByPage(offset int, limit int) (result []*models.Reference, count int64, err error) {
	result, err = r.Offset(offset).Limit(limit).Find()
	if err != nil {
		return
	}

	if size := len(result); 0 < limit && 0 < size && size < limit {
		count = int64(size + offset)
		return
	}

	count, err = r.Offset(-1).Limit(-1).Count()
	return
}

func (r referenceDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = r.Count()
	if err != nil {
		return
	}

	err = r.Offset(offset).Limit(limit).Scan(result)
	return
}

func (r referenceDo) Scan(result interface{}) (err error) {
	return r.DO.Scan(result)
}

func (r referenceDo) Delete(models ...*models.Reference) (result gen.ResultInfo, err error) {
	return r.DO.Delete(models)
}

func (r *referenceDo) withDO(do gen.Dao) *referenceDo {
	r.DO = *do.(*gen.DO)
	return r
}
