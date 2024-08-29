package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateSupplierRoutes(g *echo.Group) {
	route := g.Group("/suppliers")

	supplierController := controllers.SupplierController{SupplierRepository: &services.SupplierService{}}

	route.GET("", supplierController.ReadSuppliers, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
	route.GET("/aggregate", supplierController.AggregateSuppliers, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
	route.POST("", supplierController.CreateSupplier, middlewares.Policies(models.AllowRoles{Admin: true}))
	route.GET("/:supplierId", supplierController.ReadSupplier, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
	route.PATCH("/:supplierId", supplierController.UpdateSupplier, middlewares.Policies(models.AllowRoles{Admin: true}))

}
