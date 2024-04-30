package config

import (
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type EchoValidatorStruct struct {
	validator *validator.Validate
}

func (cv *EchoValidatorStruct) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		// Optionally, you could return the error to give each route more control over the status code
		return err
	}
	return nil
}

func EchoValidator(e *echo.Echo) {

	e.Validator = &EchoValidatorStruct{validator: validator.New()}

}
