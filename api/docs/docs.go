// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "consumes": [
        "application/json"
    ],
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/auth/login": {
            "post": {
                "description": "Given a correct user name and password get access",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Login",
                "parameters": [
                    {
                        "description": "User's credentials",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.LoginUser"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.DataAuthResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/auth/logout": {
            "post": {
                "description": "Remove the refresh token from the database and delete the cookie",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Logout",
                "responses": {
                    "204": {
                        "description": "No Content"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/auth/refresh": {
            "post": {
                "description": "Given a correct refresh cookie get access",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Refresh",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.DataAuthResponse"
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/colors": {
            "get": {
                "description": "Get all the colors, limit for query o default limit",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Colors"
                ],
                "summary": "Get colors from db",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.Color"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            },
            "post": {
                "description": "Create a new color",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Colors"
                ],
                "summary": "Create color",
                "parameters": [
                    {
                        "description": "Color create values",
                        "name": "models.ColorCreateBody",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Created",
                        "schema": {
                            "$ref": "#/definitions/models.Color"
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/colors/aggregate": {
            "get": {
                "description": "Get result of aggregate function from colors",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Colors"
                ],
                "summary": "Get aggregate from colors",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.AggregateData"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/fabrics": {
            "get": {
                "description": "Get all the fabrics, limit for query o default limit",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Fabrics"
                ],
                "summary": "Get fabrics from db",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.Fabric"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/fabrics/aggregate": {
            "get": {
                "description": "Get aggregate from fabrics",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Fabrics"
                ],
                "summary": "Get aggregate from fabrics",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.AggregateData"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/images": {
            "post": {
                "description": "Create a new image",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Files"
                ],
                "summary": "Create image",
                "responses": {
                    "201": {
                        "description": "Created",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.Image"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/reference": {
            "post": {
                "description": "Create a new reference",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "References"
                ],
                "summary": "Create reference",
                "parameters": [
                    {
                        "description": "Reference create values",
                        "name": "models.ReferenceCreateBody",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Created",
                        "schema": {
                            "$ref": "#/definitions/models.Reference"
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/resources": {
            "get": {
                "description": "Get all the resources, limit for query o default limit",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Resources"
                ],
                "summary": "Get resources from db",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.Resource"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/resources/aggregate": {
            "get": {
                "description": "Get result of aggregate function from resources",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Resources"
                ],
                "summary": "Get aggregate from resources",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.AggregateData"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/suppliers": {
            "get": {
                "description": "Get all the suppliers, limit for query o default limit",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Suppliers"
                ],
                "summary": "Get suppliers from db",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.Supplier"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/suppliers/aggregate": {
            "get": {
                "description": "Get result of aggregate function from suppliers",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Suppliers"
                ],
                "summary": "Get aggregate from suppliers",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.AggregateData"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/users": {
            "get": {
                "description": "Get all the users, limit for query o default limit",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Get users from db",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.User"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            },
            "post": {
                "description": "Create a new user",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Create user",
                "parameters": [
                    {
                        "description": "User create values",
                        "name": "models.UserCreateBody",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Created",
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/users/aggregate": {
            "get": {
                "description": "Get result of aggregate function from users",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Get aggregate from users",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.AggregateData"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/users/me": {
            "get": {
                "description": "Get the user who do the request with access token",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Get the curren user loggged",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/users/userId": {
            "get": {
                "description": "Get an user by its ID",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Get a given user",
                "parameters": [
                    {
                        "type": "string",
                        "description": "User ID",
                        "name": "userId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/users/{userId}": {
            "post": {
                "description": "Updates the fields from user",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Update use",
                "parameters": [
                    {
                        "type": "string",
                        "description": "User ID",
                        "name": "userId",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "User update values",
                        "name": "models.UpdateUserBody",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        }
    },
    "definitions": {
        "gorm.DeletedAt": {
            "type": "object",
            "properties": {
                "time": {
                    "type": "string"
                },
                "valid": {
                    "description": "Valid is true if Time is not NULL",
                    "type": "boolean"
                }
            }
        },
        "models.AggregateData": {
            "type": "object",
            "properties": {
                "count": {}
            }
        },
        "models.Color": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string"
                },
                "deleted_at": {
                    "$ref": "#/definitions/gorm.DeletedAt"
                },
                "hex": {
                    "type": "string"
                },
                "id": {
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                },
                "updated_at": {
                    "type": "string"
                }
            }
        },
        "models.DataAuthResponse": {
            "type": "object",
            "properties": {
                "access_token": {
                    "type": "string"
                },
                "expires": {
                    "type": "integer"
                }
            }
        },
        "models.Fabric": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string"
                },
                "color": {
                    "$ref": "#/definitions/models.Color"
                },
                "color_id": {
                    "type": "integer"
                },
                "cost": {
                    "type": "number"
                },
                "created_at": {
                    "type": "string"
                },
                "deleted_at": {
                    "$ref": "#/definitions/gorm.DeletedAt"
                },
                "id": {
                    "type": "integer"
                },
                "key": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "models.Image": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "location": {
                    "type": "string"
                }
            }
        },
        "models.LoginUser": {
            "type": "object",
            "required": [
                "password",
                "username"
            ],
            "properties": {
                "password": {
                    "type": "string",
                    "maxLength": 20,
                    "minLength": 8
                },
                "username": {
                    "type": "string",
                    "maxLength": 30
                }
            }
        },
        "models.Reference": {
            "type": "object",
            "properties": {
                "back": {
                    "type": "string"
                },
                "back_image": {
                    "$ref": "#/definitions/models.Image"
                },
                "create_by": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string"
                },
                "deleted_at": {
                    "$ref": "#/definitions/gorm.DeletedAt"
                },
                "front": {
                    "type": "string"
                },
                "front_image": {
                    "$ref": "#/definitions/models.Image"
                },
                "id": {
                    "type": "integer"
                },
                "key": {
                    "type": "string"
                },
                "reference": {
                    "type": "string"
                },
                "user": {
                    "$ref": "#/definitions/models.User"
                }
            }
        },
        "models.Resource": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string"
                },
                "color": {
                    "$ref": "#/definitions/models.Color"
                },
                "color_id": {
                    "type": "integer"
                },
                "cost": {
                    "type": "number"
                },
                "created_at": {
                    "type": "string"
                },
                "deleted_at": {
                    "$ref": "#/definitions/gorm.DeletedAt"
                },
                "id": {
                    "type": "integer"
                },
                "key": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "models.Supplier": {
            "type": "object",
            "properties": {
                "created_at": {
                    "type": "string"
                },
                "deleted_at": {
                    "$ref": "#/definitions/gorm.DeletedAt"
                },
                "id": {
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                },
                "nit": {
                    "type": "string"
                },
                "updated_at": {
                    "type": "string"
                }
            }
        },
        "models.User": {
            "type": "object",
            "properties": {
                "created_at": {
                    "type": "string"
                },
                "deleted_at": {
                    "$ref": "#/definitions/gorm.DeletedAt"
                },
                "id": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "role": {
                    "type": "string"
                },
                "updated_at": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "0.0",
	Host:             "",
	BasePath:         "/api/v1",
	Schemes:          []string{},
	Title:            "Vytex API",
	Description:      "",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
