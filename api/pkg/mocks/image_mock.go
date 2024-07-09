package mocks

import (
	"github.com/stretchr/testify/mock"
	"mime/multipart"
)

type ImageMock struct {
	mock.Mock
}

func (m *ImageMock) CreateImage(file *multipart.FileHeader) (string, error) {
	args := m.Called()
	return args.String(0), args.Error(1)
}
