package services

import (
	"github.com/google/uuid"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
)

type ImageService struct{}

var allowedExtensions = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
}

func (m *ImageService) CreateImage(files []*multipart.FileHeader) ([]string, error) {
	savePath := "assets/images/"
	var ids []string

	if err := os.MkdirAll(savePath, os.ModePerm); err != nil {
		return nil, problems.ServerError()
	}

	for _, file := range files {
		// open file
		src, err := file.Open()
		if err != nil {
			return nil, problems.ServerError()
		}

		defer src.Close()

		id := uuid.New().String()
		ext := filepath.Ext(file.Filename)
		location := savePath + id + ext

		// check extension
		if _, ok := allowedExtensions[ext]; !ok {
			return nil, problems.ImagesBadRequest()
		}

		dst, err := os.Create(location)

		if err != nil {
			return nil, problems.ServerError()
		}

		defer dst.Close()

		// copy
		if _, err = io.Copy(dst, src); err != nil {
			return nil, problems.ServerError()
		}

		image := &models.Image{ID: id, Location: location}

		if err = query.Image.Create(image); err != nil {
			return nil, problems.ServerError()
		}

		ids = append(ids, id)
	}

	return ids, nil
}
