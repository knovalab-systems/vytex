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

func newColorByReference(db *gorm.DB, opts ...gen.DOOption) colorByReference {
	_colorByReference := colorByReference{}

	_colorByReference.colorByReferenceDo.UseDB(db, opts...)
	_colorByReference.colorByReferenceDo.UseModel(&models.ColorByReference{})

	tableName := _colorByReference.colorByReferenceDo.TableName()
	_colorByReference.ALL = field.NewAsterisk(tableName)
	_colorByReference.ID = field.NewUint(tableName, "id")
	_colorByReference.CreatedAt = field.NewTime(tableName, "created_at")
	_colorByReference.DeletedAt = field.NewField(tableName, "deleted_at")
	_colorByReference.ColorID = field.NewUint(tableName, "color_id")
	_colorByReference.ReferenceID = field.NewUint(tableName, "reference_id")
	_colorByReference.Resources = colorByReferenceHasManyResources{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Resources", "models.ResourceByReference"),
		Resource: struct {
			field.RelationField
			Color struct {
				field.RelationField
			}
			Supplier struct {
				field.RelationField
			}
		}{
			RelationField: field.NewRelation("Resources.Resource", "models.Resource"),
			Color: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Resources.Resource.Color", "models.Color"),
			},
			Supplier: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Resources.Resource.Supplier", "models.Supplier"),
			},
		},
	}

	_colorByReference.Fabrics = colorByReferenceHasManyFabrics{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Fabrics", "models.FabricByReference"),
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
			RelationField: field.NewRelation("Fabrics.Fabric", "models.Fabric"),
			Color: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Fabrics.Fabric.Color", "models.Color"),
			},
			Supplier: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Fabrics.Fabric.Supplier", "models.Supplier"),
			},
			Composition: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Fabrics.Fabric.Composition", "models.Composition"),
			},
		},
	}

	_colorByReference.Color = colorByReferenceBelongsToColor{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Color", "models.Color"),
	}

	_colorByReference.Reference = colorByReferenceBelongsToReference{
		db: db.Session(&gorm.Session{}),

		RelationField: field.NewRelation("Reference", "models.Reference"),
		User: struct {
			field.RelationField
			Role struct {
				field.RelationField
			}
		}{
			RelationField: field.NewRelation("Reference.User", "models.User"),
			Role: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Reference.User.Role", "models.Role"),
			},
		},
		FrontImage: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Reference.FrontImage", "models.Image"),
		},
		BackImage: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Reference.BackImage", "models.Image"),
		},
		TimeByTask: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Reference.TimeByTask", "models.TimeByTask"),
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
			}
			Fabrics struct {
				field.RelationField
			}
		}{
			RelationField: field.NewRelation("Reference.Colors", "models.ColorByReference"),
			Color: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Reference.Colors.Color", "models.Color"),
			},
			Reference: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Reference.Colors.Reference", "models.Reference"),
			},
			Resources: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Reference.Colors.Resources", "models.ResourceByReference"),
			},
			Fabrics: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Reference.Colors.Fabrics", "models.FabricByReference"),
			},
		},
		Pieces: struct {
			field.RelationField
			Image struct {
				field.RelationField
			}
		}{
			RelationField: field.NewRelation("Reference.Pieces", "models.Piece"),
			Image: struct {
				field.RelationField
			}{
				RelationField: field.NewRelation("Reference.Pieces.Image", "models.Image"),
			},
		},
		Operations: struct {
			field.RelationField
		}{
			RelationField: field.NewRelation("Reference.Operations", "models.Operation"),
		},
	}

	_colorByReference.fillFieldMap()

	return _colorByReference
}

type colorByReference struct {
	colorByReferenceDo

	ALL         field.Asterisk
	ID          field.Uint
	CreatedAt   field.Time
	DeletedAt   field.Field
	ColorID     field.Uint
	ReferenceID field.Uint
	Resources   colorByReferenceHasManyResources

	Fabrics colorByReferenceHasManyFabrics

	Color colorByReferenceBelongsToColor

	Reference colorByReferenceBelongsToReference

	fieldMap map[string]field.Expr
}

func (c colorByReference) Table(newTableName string) *colorByReference {
	c.colorByReferenceDo.UseTable(newTableName)
	return c.updateTableName(newTableName)
}

func (c colorByReference) As(alias string) *colorByReference {
	c.colorByReferenceDo.DO = *(c.colorByReferenceDo.As(alias).(*gen.DO))
	return c.updateTableName(alias)
}

func (c *colorByReference) updateTableName(table string) *colorByReference {
	c.ALL = field.NewAsterisk(table)
	c.ID = field.NewUint(table, "id")
	c.CreatedAt = field.NewTime(table, "created_at")
	c.DeletedAt = field.NewField(table, "deleted_at")
	c.ColorID = field.NewUint(table, "color_id")
	c.ReferenceID = field.NewUint(table, "reference_id")

	c.fillFieldMap()

	return c
}

func (c *colorByReference) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := c.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (c *colorByReference) fillFieldMap() {
	c.fieldMap = make(map[string]field.Expr, 9)
	c.fieldMap["id"] = c.ID
	c.fieldMap["created_at"] = c.CreatedAt
	c.fieldMap["deleted_at"] = c.DeletedAt
	c.fieldMap["color_id"] = c.ColorID
	c.fieldMap["reference_id"] = c.ReferenceID

}

func (c colorByReference) clone(db *gorm.DB) colorByReference {
	c.colorByReferenceDo.ReplaceConnPool(db.Statement.ConnPool)
	return c
}

func (c colorByReference) replaceDB(db *gorm.DB) colorByReference {
	c.colorByReferenceDo.ReplaceDB(db)
	return c
}

type colorByReferenceHasManyResources struct {
	db *gorm.DB

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

func (a colorByReferenceHasManyResources) Where(conds ...field.Expr) *colorByReferenceHasManyResources {
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

func (a colorByReferenceHasManyResources) WithContext(ctx context.Context) *colorByReferenceHasManyResources {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a colorByReferenceHasManyResources) Session(session *gorm.Session) *colorByReferenceHasManyResources {
	a.db = a.db.Session(session)
	return &a
}

func (a colorByReferenceHasManyResources) Model(m *models.ColorByReference) *colorByReferenceHasManyResourcesTx {
	return &colorByReferenceHasManyResourcesTx{a.db.Model(m).Association(a.Name())}
}

type colorByReferenceHasManyResourcesTx struct{ tx *gorm.Association }

func (a colorByReferenceHasManyResourcesTx) Find() (result []*models.ResourceByReference, err error) {
	return result, a.tx.Find(&result)
}

func (a colorByReferenceHasManyResourcesTx) Append(values ...*models.ResourceByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a colorByReferenceHasManyResourcesTx) Replace(values ...*models.ResourceByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a colorByReferenceHasManyResourcesTx) Delete(values ...*models.ResourceByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a colorByReferenceHasManyResourcesTx) Clear() error {
	return a.tx.Clear()
}

func (a colorByReferenceHasManyResourcesTx) Count() int64 {
	return a.tx.Count()
}

type colorByReferenceHasManyFabrics struct {
	db *gorm.DB

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

func (a colorByReferenceHasManyFabrics) Where(conds ...field.Expr) *colorByReferenceHasManyFabrics {
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

func (a colorByReferenceHasManyFabrics) WithContext(ctx context.Context) *colorByReferenceHasManyFabrics {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a colorByReferenceHasManyFabrics) Session(session *gorm.Session) *colorByReferenceHasManyFabrics {
	a.db = a.db.Session(session)
	return &a
}

func (a colorByReferenceHasManyFabrics) Model(m *models.ColorByReference) *colorByReferenceHasManyFabricsTx {
	return &colorByReferenceHasManyFabricsTx{a.db.Model(m).Association(a.Name())}
}

type colorByReferenceHasManyFabricsTx struct{ tx *gorm.Association }

func (a colorByReferenceHasManyFabricsTx) Find() (result []*models.FabricByReference, err error) {
	return result, a.tx.Find(&result)
}

func (a colorByReferenceHasManyFabricsTx) Append(values ...*models.FabricByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a colorByReferenceHasManyFabricsTx) Replace(values ...*models.FabricByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a colorByReferenceHasManyFabricsTx) Delete(values ...*models.FabricByReference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a colorByReferenceHasManyFabricsTx) Clear() error {
	return a.tx.Clear()
}

func (a colorByReferenceHasManyFabricsTx) Count() int64 {
	return a.tx.Count()
}

type colorByReferenceBelongsToColor struct {
	db *gorm.DB

	field.RelationField
}

func (a colorByReferenceBelongsToColor) Where(conds ...field.Expr) *colorByReferenceBelongsToColor {
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

func (a colorByReferenceBelongsToColor) WithContext(ctx context.Context) *colorByReferenceBelongsToColor {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a colorByReferenceBelongsToColor) Session(session *gorm.Session) *colorByReferenceBelongsToColor {
	a.db = a.db.Session(session)
	return &a
}

func (a colorByReferenceBelongsToColor) Model(m *models.ColorByReference) *colorByReferenceBelongsToColorTx {
	return &colorByReferenceBelongsToColorTx{a.db.Model(m).Association(a.Name())}
}

type colorByReferenceBelongsToColorTx struct{ tx *gorm.Association }

func (a colorByReferenceBelongsToColorTx) Find() (result *models.Color, err error) {
	return result, a.tx.Find(&result)
}

func (a colorByReferenceBelongsToColorTx) Append(values ...*models.Color) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a colorByReferenceBelongsToColorTx) Replace(values ...*models.Color) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a colorByReferenceBelongsToColorTx) Delete(values ...*models.Color) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a colorByReferenceBelongsToColorTx) Clear() error {
	return a.tx.Clear()
}

func (a colorByReferenceBelongsToColorTx) Count() int64 {
	return a.tx.Count()
}

type colorByReferenceBelongsToReference struct {
	db *gorm.DB

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
		Color struct {
			field.RelationField
		}
		Reference struct {
			field.RelationField
		}
		Resources struct {
			field.RelationField
		}
		Fabrics struct {
			field.RelationField
		}
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

func (a colorByReferenceBelongsToReference) Where(conds ...field.Expr) *colorByReferenceBelongsToReference {
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

func (a colorByReferenceBelongsToReference) WithContext(ctx context.Context) *colorByReferenceBelongsToReference {
	a.db = a.db.WithContext(ctx)
	return &a
}

func (a colorByReferenceBelongsToReference) Session(session *gorm.Session) *colorByReferenceBelongsToReference {
	a.db = a.db.Session(session)
	return &a
}

func (a colorByReferenceBelongsToReference) Model(m *models.ColorByReference) *colorByReferenceBelongsToReferenceTx {
	return &colorByReferenceBelongsToReferenceTx{a.db.Model(m).Association(a.Name())}
}

type colorByReferenceBelongsToReferenceTx struct{ tx *gorm.Association }

func (a colorByReferenceBelongsToReferenceTx) Find() (result *models.Reference, err error) {
	return result, a.tx.Find(&result)
}

func (a colorByReferenceBelongsToReferenceTx) Append(values ...*models.Reference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Append(targetValues...)
}

func (a colorByReferenceBelongsToReferenceTx) Replace(values ...*models.Reference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Replace(targetValues...)
}

func (a colorByReferenceBelongsToReferenceTx) Delete(values ...*models.Reference) (err error) {
	targetValues := make([]interface{}, len(values))
	for i, v := range values {
		targetValues[i] = v
	}
	return a.tx.Delete(targetValues...)
}

func (a colorByReferenceBelongsToReferenceTx) Clear() error {
	return a.tx.Clear()
}

func (a colorByReferenceBelongsToReferenceTx) Count() int64 {
	return a.tx.Count()
}

type colorByReferenceDo struct{ gen.DO }

type IColorByReferenceDo interface {
	gen.SubQuery
	Debug() IColorByReferenceDo
	WithContext(ctx context.Context) IColorByReferenceDo
	WithResult(fc func(tx gen.Dao)) gen.ResultInfo
	ReplaceDB(db *gorm.DB)
	ReadDB() IColorByReferenceDo
	WriteDB() IColorByReferenceDo
	As(alias string) gen.Dao
	Session(config *gorm.Session) IColorByReferenceDo
	Columns(cols ...field.Expr) gen.Columns
	Clauses(conds ...clause.Expression) IColorByReferenceDo
	Not(conds ...gen.Condition) IColorByReferenceDo
	Or(conds ...gen.Condition) IColorByReferenceDo
	Select(conds ...field.Expr) IColorByReferenceDo
	Where(conds ...gen.Condition) IColorByReferenceDo
	Order(conds ...field.Expr) IColorByReferenceDo
	Distinct(cols ...field.Expr) IColorByReferenceDo
	Omit(cols ...field.Expr) IColorByReferenceDo
	Join(table schema.Tabler, on ...field.Expr) IColorByReferenceDo
	LeftJoin(table schema.Tabler, on ...field.Expr) IColorByReferenceDo
	RightJoin(table schema.Tabler, on ...field.Expr) IColorByReferenceDo
	Group(cols ...field.Expr) IColorByReferenceDo
	Having(conds ...gen.Condition) IColorByReferenceDo
	Limit(limit int) IColorByReferenceDo
	Offset(offset int) IColorByReferenceDo
	Count() (count int64, err error)
	Scopes(funcs ...func(gen.Dao) gen.Dao) IColorByReferenceDo
	Unscoped() IColorByReferenceDo
	Create(values ...*models.ColorByReference) error
	CreateInBatches(values []*models.ColorByReference, batchSize int) error
	Save(values ...*models.ColorByReference) error
	First() (*models.ColorByReference, error)
	Take() (*models.ColorByReference, error)
	Last() (*models.ColorByReference, error)
	Find() ([]*models.ColorByReference, error)
	FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.ColorByReference, err error)
	FindInBatches(result *[]*models.ColorByReference, batchSize int, fc func(tx gen.Dao, batch int) error) error
	Pluck(column field.Expr, dest interface{}) error
	Delete(...*models.ColorByReference) (info gen.ResultInfo, err error)
	Update(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	Updates(value interface{}) (info gen.ResultInfo, err error)
	UpdateColumn(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateColumnSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	UpdateColumns(value interface{}) (info gen.ResultInfo, err error)
	UpdateFrom(q gen.SubQuery) gen.Dao
	Attrs(attrs ...field.AssignExpr) IColorByReferenceDo
	Assign(attrs ...field.AssignExpr) IColorByReferenceDo
	Joins(fields ...field.RelationField) IColorByReferenceDo
	Preload(fields ...field.RelationField) IColorByReferenceDo
	FirstOrInit() (*models.ColorByReference, error)
	FirstOrCreate() (*models.ColorByReference, error)
	FindByPage(offset int, limit int) (result []*models.ColorByReference, count int64, err error)
	ScanByPage(result interface{}, offset int, limit int) (count int64, err error)
	Scan(result interface{}) (err error)
	Returning(value interface{}, columns ...string) IColorByReferenceDo
	UnderlyingDB() *gorm.DB
	schema.Tabler
}

func (c colorByReferenceDo) Debug() IColorByReferenceDo {
	return c.withDO(c.DO.Debug())
}

func (c colorByReferenceDo) WithContext(ctx context.Context) IColorByReferenceDo {
	return c.withDO(c.DO.WithContext(ctx))
}

func (c colorByReferenceDo) ReadDB() IColorByReferenceDo {
	return c.Clauses(dbresolver.Read)
}

func (c colorByReferenceDo) WriteDB() IColorByReferenceDo {
	return c.Clauses(dbresolver.Write)
}

func (c colorByReferenceDo) Session(config *gorm.Session) IColorByReferenceDo {
	return c.withDO(c.DO.Session(config))
}

func (c colorByReferenceDo) Clauses(conds ...clause.Expression) IColorByReferenceDo {
	return c.withDO(c.DO.Clauses(conds...))
}

func (c colorByReferenceDo) Returning(value interface{}, columns ...string) IColorByReferenceDo {
	return c.withDO(c.DO.Returning(value, columns...))
}

func (c colorByReferenceDo) Not(conds ...gen.Condition) IColorByReferenceDo {
	return c.withDO(c.DO.Not(conds...))
}

func (c colorByReferenceDo) Or(conds ...gen.Condition) IColorByReferenceDo {
	return c.withDO(c.DO.Or(conds...))
}

func (c colorByReferenceDo) Select(conds ...field.Expr) IColorByReferenceDo {
	return c.withDO(c.DO.Select(conds...))
}

func (c colorByReferenceDo) Where(conds ...gen.Condition) IColorByReferenceDo {
	return c.withDO(c.DO.Where(conds...))
}

func (c colorByReferenceDo) Order(conds ...field.Expr) IColorByReferenceDo {
	return c.withDO(c.DO.Order(conds...))
}

func (c colorByReferenceDo) Distinct(cols ...field.Expr) IColorByReferenceDo {
	return c.withDO(c.DO.Distinct(cols...))
}

func (c colorByReferenceDo) Omit(cols ...field.Expr) IColorByReferenceDo {
	return c.withDO(c.DO.Omit(cols...))
}

func (c colorByReferenceDo) Join(table schema.Tabler, on ...field.Expr) IColorByReferenceDo {
	return c.withDO(c.DO.Join(table, on...))
}

func (c colorByReferenceDo) LeftJoin(table schema.Tabler, on ...field.Expr) IColorByReferenceDo {
	return c.withDO(c.DO.LeftJoin(table, on...))
}

func (c colorByReferenceDo) RightJoin(table schema.Tabler, on ...field.Expr) IColorByReferenceDo {
	return c.withDO(c.DO.RightJoin(table, on...))
}

func (c colorByReferenceDo) Group(cols ...field.Expr) IColorByReferenceDo {
	return c.withDO(c.DO.Group(cols...))
}

func (c colorByReferenceDo) Having(conds ...gen.Condition) IColorByReferenceDo {
	return c.withDO(c.DO.Having(conds...))
}

func (c colorByReferenceDo) Limit(limit int) IColorByReferenceDo {
	return c.withDO(c.DO.Limit(limit))
}

func (c colorByReferenceDo) Offset(offset int) IColorByReferenceDo {
	return c.withDO(c.DO.Offset(offset))
}

func (c colorByReferenceDo) Scopes(funcs ...func(gen.Dao) gen.Dao) IColorByReferenceDo {
	return c.withDO(c.DO.Scopes(funcs...))
}

func (c colorByReferenceDo) Unscoped() IColorByReferenceDo {
	return c.withDO(c.DO.Unscoped())
}

func (c colorByReferenceDo) Create(values ...*models.ColorByReference) error {
	if len(values) == 0 {
		return nil
	}
	return c.DO.Create(values)
}

func (c colorByReferenceDo) CreateInBatches(values []*models.ColorByReference, batchSize int) error {
	return c.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (c colorByReferenceDo) Save(values ...*models.ColorByReference) error {
	if len(values) == 0 {
		return nil
	}
	return c.DO.Save(values)
}

func (c colorByReferenceDo) First() (*models.ColorByReference, error) {
	if result, err := c.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*models.ColorByReference), nil
	}
}

func (c colorByReferenceDo) Take() (*models.ColorByReference, error) {
	if result, err := c.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*models.ColorByReference), nil
	}
}

func (c colorByReferenceDo) Last() (*models.ColorByReference, error) {
	if result, err := c.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*models.ColorByReference), nil
	}
}

func (c colorByReferenceDo) Find() ([]*models.ColorByReference, error) {
	result, err := c.DO.Find()
	return result.([]*models.ColorByReference), err
}

func (c colorByReferenceDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*models.ColorByReference, err error) {
	buf := make([]*models.ColorByReference, 0, batchSize)
	err = c.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (c colorByReferenceDo) FindInBatches(result *[]*models.ColorByReference, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return c.DO.FindInBatches(result, batchSize, fc)
}

func (c colorByReferenceDo) Attrs(attrs ...field.AssignExpr) IColorByReferenceDo {
	return c.withDO(c.DO.Attrs(attrs...))
}

func (c colorByReferenceDo) Assign(attrs ...field.AssignExpr) IColorByReferenceDo {
	return c.withDO(c.DO.Assign(attrs...))
}

func (c colorByReferenceDo) Joins(fields ...field.RelationField) IColorByReferenceDo {
	for _, _f := range fields {
		c = *c.withDO(c.DO.Joins(_f))
	}
	return &c
}

func (c colorByReferenceDo) Preload(fields ...field.RelationField) IColorByReferenceDo {
	for _, _f := range fields {
		c = *c.withDO(c.DO.Preload(_f))
	}
	return &c
}

func (c colorByReferenceDo) FirstOrInit() (*models.ColorByReference, error) {
	if result, err := c.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*models.ColorByReference), nil
	}
}

func (c colorByReferenceDo) FirstOrCreate() (*models.ColorByReference, error) {
	if result, err := c.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*models.ColorByReference), nil
	}
}

func (c colorByReferenceDo) FindByPage(offset int, limit int) (result []*models.ColorByReference, count int64, err error) {
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

func (c colorByReferenceDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = c.Count()
	if err != nil {
		return
	}

	err = c.Offset(offset).Limit(limit).Scan(result)
	return
}

func (c colorByReferenceDo) Scan(result interface{}) (err error) {
	return c.DO.Scan(result)
}

func (c colorByReferenceDo) Delete(models ...*models.ColorByReference) (result gen.ResultInfo, err error) {
	return c.DO.Delete(models)
}

func (c *colorByReferenceDo) withDO(do gen.Dao) *colorByReferenceDo {
	c.DO = *do.(*gen.DO)
	return c
}
