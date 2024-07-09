package services

import (
	"github.com/google/uuid"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"io"
	"mime/multipart"
	"os"
	"strings"
)

type ImageService struct{}

func (m *ImageService) CreateImage(file *multipart.FileHeader) (string, error) {
	savePath := "assents/images/"

	if err := os.MkdirAll(savePath, os.ModePerm); err != nil {
		return "", problems.FilesBadRequest()
	}

	// open file
	src, err := file.Open()
	if err != nil {

		return "", problems.ServerError()
	}
	defer src.Close()

	id := uuid.New().String()
	location := strings.ReplaceAll(savePath+id+"_"+file.Filename, " ", "")
	dst, err := os.Create(location)

	if err != nil {
		return "", problems.ServerError()
	}
	defer dst.Close()

	// copy content to dst
	if _, err = io.Copy(dst, src); err != nil {
		return "", problems.ServerError()
	}

	// create image in db
	image := &models.Image{ID: id, Location: location}
	err = query.Image.Create(image)

	return id, nil
}
