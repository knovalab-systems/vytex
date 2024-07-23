package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateSupplierRoutes(g *echo.Group) {
	route := g.Group("/suppliers")

	supplierController := controllers.SupplierController{SupplierRepository: &services.SupplierService{}}

	route.GET("", supplierController.ReadSuppliers)
	route.GET("/aggregate", supplierController.AggregateSuppliers)
	route.POST("", supplierController.CreateSupplier)
	route.GET("/:supplierId", supplierController.ReadSupplier)

}
