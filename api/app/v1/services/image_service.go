package services

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
)

type ImageService struct{}

func (m *ImageService) CreateImage(file *multipart.FileHeader) (string, error) {
	savePath := "api/assents/images"

	// open file
	src, err := file.Open()
	if err != nil {
		return "", problems.FilesBadRequest()
	}
	defer src.Close()

	// save file
	dstPath := filepath.Join(savePath, file.Filename)
	dst, err := os.Create(dstPath)
	if err != nil {
		return "", problems.FilesBadRequest()
	}
	defer dst.Close()

	// create image
	image := &models.Image{Location: dstPath}
	err = query.Image.Create(image)

	// copy content to dst
	if _, err = io.Copy(dst, src); err != nil {
		return "", problems.FilesBadRequest()
	}

	return dstPath, nil
}
