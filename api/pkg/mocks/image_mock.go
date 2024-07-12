package mocks

import (
	"github.com/stretchr/testify/mock"
	"mime/multipart"
)

type ImageMock struct {
	mock.Mock
}

func (m *ImageMock) CreateImage(files []*multipart.FileHeader) ([]string, error) {
	args := m.Called(files)
	return args.Get(0).([]string), args.Error(1)
}
