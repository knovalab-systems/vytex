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

	route.GET("", supplierController.ReadSuppliers, middlewares.Policies([]models.Policie{models.ReadSuppliers, models.CreateFabrics, models.UpdateFabrics, models.CreateResources, models.UpdateResources}))
	route.GET("/aggregate", supplierController.AggregateSuppliers, middlewares.Policies([]models.Policie{models.ReadSuppliers}))
	route.POST("", supplierController.CreateSupplier, middlewares.Policies([]models.Policie{models.CreateSuppliers}))
	route.GET("/:supplierId", supplierController.ReadSupplier, middlewares.Policies([]models.Policie{models.ReadSuppliers, models.UpdateSuppliers}))
	route.PATCH("/:supplierId", supplierController.UpdateSupplier, middlewares.Policies([]models.Policie{models.UpdateSuppliers}))
}
