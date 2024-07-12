// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package query

import (
	"context"
	"database/sql"

	"gorm.io/gorm"

	"gorm.io/gen"

	"gorm.io/plugin/dbresolver"
)

var (
	Q                   = new(Query)
	Color               *color
	ColorByReference    *colorByReference
	Fabric              *fabric
	FabricByReference   *fabricByReference
	Image               *image
	Reference           *reference
	Resource            *resource
	ResourceByReference *resourceByReference
	Session             *session
	Supplier            *supplier
	User                *user
)

func SetDefault(db *gorm.DB, opts ...gen.DOOption) {
	*Q = *Use(db, opts...)
	Color = &Q.Color
	ColorByReference = &Q.ColorByReference
	Fabric = &Q.Fabric
	FabricByReference = &Q.FabricByReference
	Image = &Q.Image
	Reference = &Q.Reference
	Resource = &Q.Resource
	ResourceByReference = &Q.ResourceByReference
	Session = &Q.Session
	Supplier = &Q.Supplier
	User = &Q.User
}

func Use(db *gorm.DB, opts ...gen.DOOption) *Query {
	return &Query{
		db:                  db,
		Color:               newColor(db, opts...),
		ColorByReference:    newColorByReference(db, opts...),
		Fabric:              newFabric(db, opts...),
		FabricByReference:   newFabricByReference(db, opts...),
		Image:               newImage(db, opts...),
		Reference:           newReference(db, opts...),
		Resource:            newResource(db, opts...),
		ResourceByReference: newResourceByReference(db, opts...),
		Session:             newSession(db, opts...),
		Supplier:            newSupplier(db, opts...),
		User:                newUser(db, opts...),
	}
}

type Query struct {
	db *gorm.DB

	Color               color
	ColorByReference    colorByReference
	Fabric              fabric
	FabricByReference   fabricByReference
	Image               image
	Reference           reference
	Resource            resource
	ResourceByReference resourceByReference
	Session             session
	Supplier            supplier
	User                user
}

func (q *Query) Available() bool { return q.db != nil }

func (q *Query) clone(db *gorm.DB) *Query {
	return &Query{
		db:                  db,
		Color:               q.Color.clone(db),
		ColorByReference:    q.ColorByReference.clone(db),
		Fabric:              q.Fabric.clone(db),
		FabricByReference:   q.FabricByReference.clone(db),
		Image:               q.Image.clone(db),
		Reference:           q.Reference.clone(db),
		Resource:            q.Resource.clone(db),
		ResourceByReference: q.ResourceByReference.clone(db),
		Session:             q.Session.clone(db),
		Supplier:            q.Supplier.clone(db),
		User:                q.User.clone(db),
	}
}

func (q *Query) ReadDB() *Query {
	return q.ReplaceDB(q.db.Clauses(dbresolver.Read))
}

func (q *Query) WriteDB() *Query {
	return q.ReplaceDB(q.db.Clauses(dbresolver.Write))
}

func (q *Query) ReplaceDB(db *gorm.DB) *Query {
	return &Query{
		db:                  db,
		Color:               q.Color.replaceDB(db),
		ColorByReference:    q.ColorByReference.replaceDB(db),
		Fabric:              q.Fabric.replaceDB(db),
		FabricByReference:   q.FabricByReference.replaceDB(db),
		Image:               q.Image.replaceDB(db),
		Reference:           q.Reference.replaceDB(db),
		Resource:            q.Resource.replaceDB(db),
		ResourceByReference: q.ResourceByReference.replaceDB(db),
		Session:             q.Session.replaceDB(db),
		Supplier:            q.Supplier.replaceDB(db),
		User:                q.User.replaceDB(db),
	}
}

type queryCtx struct {
	Color               IColorDo
	ColorByReference    IColorByReferenceDo
	Fabric              IFabricDo
	FabricByReference   IFabricByReferenceDo
	Image               IImageDo
	Reference           IReferenceDo
	Resource            IResourceDo
	ResourceByReference IResourceByReferenceDo
	Session             ISessionDo
	Supplier            ISupplierDo
	User                IUserDo
}

func (q *Query) WithContext(ctx context.Context) *queryCtx {
	return &queryCtx{
		Color:               q.Color.WithContext(ctx),
		ColorByReference:    q.ColorByReference.WithContext(ctx),
		Fabric:              q.Fabric.WithContext(ctx),
		FabricByReference:   q.FabricByReference.WithContext(ctx),
		Image:               q.Image.WithContext(ctx),
		Reference:           q.Reference.WithContext(ctx),
		Resource:            q.Resource.WithContext(ctx),
		ResourceByReference: q.ResourceByReference.WithContext(ctx),
		Session:             q.Session.WithContext(ctx),
		Supplier:            q.Supplier.WithContext(ctx),
		User:                q.User.WithContext(ctx),
	}
}

func (q *Query) Transaction(fc func(tx *Query) error, opts ...*sql.TxOptions) error {
	return q.db.Transaction(func(tx *gorm.DB) error { return fc(q.clone(tx)) }, opts...)
}

func (q *Query) Begin(opts ...*sql.TxOptions) *QueryTx {
	tx := q.db.Begin(opts...)
	return &QueryTx{Query: q.clone(tx), Error: tx.Error}
}

type QueryTx struct {
	*Query
	Error error
}

func (q *QueryTx) Commit() error {
	return q.db.Commit().Error
}

func (q *QueryTx) Rollback() error {
	return q.db.Rollback().Error
}

func (q *QueryTx) SavePoint(name string) error {
	return q.db.SavePoint(name).Error
}

func (q *QueryTx) RollbackTo(name string) error {
	return q.db.RollbackTo(name).Error
}
