package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestReadReferences(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail on get references", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		referenceMock := mocks.ReferenceMock{}
		referenceMock.On("SelectReferences").Return(defaultError)

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.ReadReferences(c)
		assert.Error(t, err)
	})

	t.Run("Get references succesfully ", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		referenceMock := mocks.ReferenceMock{}
		referenceMock.On("SelectReferences").Return(nil)

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.ReadReferences(c)
		assert.NoError(t, err)
	})
}

func TestAggregateReferences(t *testing.T) {

	t.Run("Fail on get aggregate references", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("count", "*")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		referenceMock := mocks.ReferenceMock{}
		referenceMock.On("AggregationReferences", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, errors.New("ERROR"))

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.AggregateReferences(c)
		assert.Error(t, err)
	})

	t.Run("Get aggregate references succesfully ", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("count", "*")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		referenceMock := mocks.ReferenceMock{}
		referenceMock.On("AggregationReferences", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, nil)

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.AggregateReferences(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestCreateReference(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail binding, colors", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"colors": 123})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		referenceMock := mocks.ReferenceMock{}

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.CreateReference(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail binding, colors", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"colors": []map[string]any{{"color_id": "texto"}}})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		referenceMock := mocks.ReferenceMock{}

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.CreateReference(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail binding, fabrics", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"colors": []map[string]any{{"fabrics": 123}}})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		referenceMock := mocks.ReferenceMock{}

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.CreateReference(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail binding, resources", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"colors": []map[string]any{{"resources": 123}}})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		referenceMock := mocks.ReferenceMock{}

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.CreateReference(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validation, reference", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"code": nil})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		referenceMock := mocks.ReferenceMock{}

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.CreateReference(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validation, user uuid", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"resources": 1.23})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "33232"}})

		// mocks
		referenceMock := mocks.ReferenceMock{}

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.CreateReference(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validation, colors", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"code": "23"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		referenceMock := mocks.ReferenceMock{}

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.CreateReference(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validation, fabrics n resources", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"code": "23", "colors": []map[string]any{{"fabrics": []map[string]any{}, "resources": []map[string]any{}}}})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		referenceMock := mocks.ReferenceMock{}

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.CreateReference(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail create reference", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"code": "23", "colors": []map[string]any{{"color_id": 1, "fabrics": []map[string]any{{"fabric_id": 1}}, "resources": []map[string]any{{"resource_id": 1}}}}})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		referenceMock := mocks.ReferenceMock{}
		referenceMock.On("CreateReference").Return(defaultError)

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.CreateReference(c)
		assert.Error(t, err)
	})

	t.Run("Create reference succesfully", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"code": "23",
			"front": "31b63ffb-15f5-48d7-9a24-587f437f07ec", "back": "31b63ffb-15f5-48d7-9a24-587f437f07ec",
			"colors": []map[string]any{{"color_id": 1,
				"fabrics":   []map[string]any{{"fabric_id": 1}},
				"resources": []map[string]any{{"resource_id": 1}}}}})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		referenceMock := mocks.ReferenceMock{}
		referenceMock.On("CreateReference").Return(nil)

		// controller
		controller := ReferenceController{ReferenceRepository: &referenceMock}

		// test
		err := controller.CreateReference(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})

}
