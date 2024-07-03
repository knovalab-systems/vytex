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

func newImage(db *gorm.DB, opts ...gen.DOOption) image {
	_image := image{}

	_image.imageDo.UseDB(db, opts...)
	_image.imageDo.UseModel(&models.Image{})

	tableName := _image.imageDo.TableName()
	_image.ALL = field.NewAsterisk(tableName)
	_image.ID = field.NewString(tableName, "id")
	_image.Location = field.NewString(tableName, "location")

	_image.fillFieldMap()

	return _image
}

type image struct {
	imageDo

	ALL      field.Asterisk
	ID       field.String
	Location field.String

	fieldMap map[string]field.Expr
}

func (i image) Table(newTableName string) *image {
	i.imageDo.UseTable(newTableName)
	return i.updateTableName(newTableName)
}

func (i image) As(alias string) *image {
	i.imageDo.DO = *(i.imageDo.As(alias).(*gen.DO))
	return i.updateTableName(alias)
}

func (i *image) updateTableName(table string) *image {
	i.ALL = field.NewAsterisk(table)
	i.ID = field.NewString(table, "id")
	i.Location = field.NewString(table, "location")

	i.fillFieldMap()

	return i
}

func (i *image) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := i.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (i *image) fillFieldMap() {
	i.fieldMap = make(map[string]field.Expr, 2)
	i.fieldMap["id"] = i.ID
	i.fieldMap["location"] = i.Location
}

func (i image) clone(db *gorm.DB) image {
	i.imageDo.ReplaceConnPool(db.Statement.ConnPool)
	return i
}

func (i image) replaceDB(db *gorm.DB) image {
	i.imageDo.ReplaceDB(db)
	return i
}

type imageDo struct{ gen.DO }

type IImageDo interface {
	gen.SubQuery
	Debug() IImageDo
	WithContext(ctx context.Context) IImageDo
	WithResult(fc func(tx gen.Dao)) gen.ResultInfo
	ReplaceDB(db *gorm.DB)
	ReadDB() IImageDo
	WriteDB() IImageDo
	As(alias string) gen.Dao
	Session(config *gorm.Session) IImageDo
	Columns(cols ...field.Expr) gen.Columns
	Clauses(conds ...clause.Expression) IImageDo
	Not(conds ...gen.Condition) IImageDo
	Or(conds ...gen.Condition) IImageDo
	Select(conds ...field.Expr) IImageDo
	Where(conds ...gen.Condition) IImageDo
	Order(conds ...field.Expr) IImageDo
	Distinct(cols ...field.Expr) IImageDo
	Omit(cols ...field.Expr) IImageDo
	Join(table schema.Tabler, on ...field.Expr) IImageDo
	LeftJoin(table schema.Tabler, on ...field.Expr) IImageDo
	RightJoin(table schema.Tabler, on ...field.Expr) IImageDo
	Group(cols ...field.Expr) IImageDo
	Having(conds ...gen.Condition) IImageDo
	Limit(limit int) IImageDo
	Offset(offset int) IImageDo
	Count() (count int64, err error)
	Scopes(funcs ...func(gen.Dao) gen.Dao) IImageDo
	Unscoped() IImageDo
	Create(values ...*models.Image) error
	CreateInBatches(values []*models.Image, batchSize int) error
	Save(values ...*models.Image) error
	First() (*models.Image, error)
	Take() (*models.Image, error)
	Last() (*models.Image, error)
	Find() ([]*models.Image, error)
	FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.Image, err error)
	FindInBatches(result *[]*models.Image, batchSize int, fc func(tx gen.Dao, batch int) error) error
	Pluck(column field.Expr, dest interface{}) error
	Delete(...*models.Image) (info gen.ResultInfo, err error)
	Update(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	Updates(value interface{}) (info gen.ResultInfo, err error)
	UpdateColumn(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateColumnSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	UpdateColumns(value interface{}) (info gen.ResultInfo, err error)
	UpdateFrom(q gen.SubQuery) gen.Dao
	Attrs(attrs ...field.AssignExpr) IImageDo
	Assign(attrs ...field.AssignExpr) IImageDo
	Joins(fields ...field.RelationField) IImageDo
	Preload(fields ...field.RelationField) IImageDo
	FirstOrInit() (*models.Image, error)
	FirstOrCreate() (*models.Image, error)
	FindByPage(offset int, limit int) (result []*models.Image, count int64, err error)
	ScanByPage(result interface{}, offset int, limit int) (count int64, err error)
	Scan(result interface{}) (err error)
	Returning(value interface{}, columns ...string) IImageDo
	UnderlyingDB() *gorm.DB
	schema.Tabler
}

func (i imageDo) Debug() IImageDo {
	return i.withDO(i.DO.Debug())
}

func (i imageDo) WithContext(ctx context.Context) IImageDo {
	return i.withDO(i.DO.WithContext(ctx))
}

func (i imageDo) ReadDB() IImageDo {
	return i.Clauses(dbresolver.Read)
}

func (i imageDo) WriteDB() IImageDo {
	return i.Clauses(dbresolver.Write)
}

func (i imageDo) Session(config *gorm.Session) IImageDo {
	return i.withDO(i.DO.Session(config))
}

func (i imageDo) Clauses(conds ...clause.Expression) IImageDo {
	return i.withDO(i.DO.Clauses(conds...))
}

func (i imageDo) Returning(value interface{}, columns ...string) IImageDo {
	return i.withDO(i.DO.Returning(value, columns...))
}

func (i imageDo) Not(conds ...gen.Condition) IImageDo {
	return i.withDO(i.DO.Not(conds...))
}

func (i imageDo) Or(conds ...gen.Condition) IImageDo {
	return i.withDO(i.DO.Or(conds...))
}

func (i imageDo) Select(conds ...field.Expr) IImageDo {
	return i.withDO(i.DO.Select(conds...))
}

func (i imageDo) Where(conds ...gen.Condition) IImageDo {
	return i.withDO(i.DO.Where(conds...))
}

func (i imageDo) Order(conds ...field.Expr) IImageDo {
	return i.withDO(i.DO.Order(conds...))
}

func (i imageDo) Distinct(cols ...field.Expr) IImageDo {
	return i.withDO(i.DO.Distinct(cols...))
}

func (i imageDo) Omit(cols ...field.Expr) IImageDo {
	return i.withDO(i.DO.Omit(cols...))
}

func (i imageDo) Join(table schema.Tabler, on ...field.Expr) IImageDo {
	return i.withDO(i.DO.Join(table, on...))
}

func (i imageDo) LeftJoin(table schema.Tabler, on ...field.Expr) IImageDo {
	return i.withDO(i.DO.LeftJoin(table, on...))
}

func (i imageDo) RightJoin(table schema.Tabler, on ...field.Expr) IImageDo {
	return i.withDO(i.DO.RightJoin(table, on...))
}

func (i imageDo) Group(cols ...field.Expr) IImageDo {
	return i.withDO(i.DO.Group(cols...))
}

func (i imageDo) Having(conds ...gen.Condition) IImageDo {
	return i.withDO(i.DO.Having(conds...))
}

func (i imageDo) Limit(limit int) IImageDo {
	return i.withDO(i.DO.Limit(limit))
}

func (i imageDo) Offset(offset int) IImageDo {
	return i.withDO(i.DO.Offset(offset))
}

func (i imageDo) Scopes(funcs ...func(gen.Dao) gen.Dao) IImageDo {
	return i.withDO(i.DO.Scopes(funcs...))
}

func (i imageDo) Unscoped() IImageDo {
	return i.withDO(i.DO.Unscoped())
}

func (i imageDo) Create(values ...*models.Image) error {
	if len(values) == 0 {
		return nil
	}
	return i.DO.Create(values)
}

func (i imageDo) CreateInBatches(values []*models.Image, batchSize int) error {
	return i.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (i imageDo) Save(values ...*models.Image) error {
	if len(values) == 0 {
		return nil
	}
	return i.DO.Save(values)
}

func (i imageDo) First() (*models.Image, error) {
	if result, err := i.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*models.Image), nil
	}
}

func (i imageDo) Take() (*models.Image, error) {
	if result, err := i.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*models.Image), nil
	}
}

func (i imageDo) Last() (*models.Image, error) {
	if result, err := i.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*models.Image), nil
	}
}

func (i imageDo) Find() ([]*models.Image, error) {
	result, err := i.DO.Find()
	return result.([]*models.Image), err
}

func (i imageDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.Image, err error) {
	buf := make([]*models.Image, 0, batchSize)
	err = i.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (i imageDo) FindInBatches(result *[]*models.Image, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return i.DO.FindInBatches(result, batchSize, fc)
}

func (i imageDo) Attrs(attrs ...field.AssignExpr) IImageDo {
	return i.withDO(i.DO.Attrs(attrs...))
}

func (i imageDo) Assign(attrs ...field.AssignExpr) IImageDo {
	return i.withDO(i.DO.Assign(attrs...))
}

func (i imageDo) Joins(fields ...field.RelationField) IImageDo {
	for _, _f := range fields {
		i = *i.withDO(i.DO.Joins(_f))
	}
	return &i
}

func (i imageDo) Preload(fields ...field.RelationField) IImageDo {
	for _, _f := range fields {
		i = *i.withDO(i.DO.Preload(_f))
	}
	return &i
}

func (i imageDo) FirstOrInit() (*models.Image, error) {
	if result, err := i.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*models.Image), nil
	}
}

func (i imageDo) FirstOrCreate() (*models.Image, error) {
	if result, err := i.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*models.Image), nil
	}
}

func (i imageDo) FindByPage(offset int, limit int) (result []*models.Image, count int64, err error) {
	result, err = i.Offset(offset).Limit(limit).Find()
	if err != nil {
		return
	}

	if size := len(result); 0 < limit && 0 < size && size < limit {
		count = int64(size + offset)
		return
	}

	count, err = i.Offset(-1).Limit(-1).Count()
	return
}

func (i imageDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = i.Count()
	if err != nil {
		return
	}

	err = i.Offset(offset).Limit(limit).Scan(result)
	return
}

func (i imageDo) Scan(result interface{}) (err error) {
	return i.DO.Scan(result)
}

func (i imageDo) Delete(models ...*models.Image) (result gen.ResultInfo, err error) {
	return i.DO.Delete(models)
}

func (i *imageDo) withDO(do gen.Dao) *imageDo {
	i.DO = *do.(*gen.DO)
	return i
}
