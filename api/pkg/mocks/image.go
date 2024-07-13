package mocks

import (
	"mime/multipart"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type ImageMock struct {
	mock.Mock
}

func (m *ImageMock) CreateImage(files []*multipart.FileHeader) ([]*models.Image, error) {
	args := m.Called(files)
	return args.Get(0).([]*models.Image), args.Error(1)
}
