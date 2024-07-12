package repository

import (
	"mime/multipart"

	"github.com/knovalab-systems/vytex/app/v1/models"
)

type ImageRepository interface {
	CreateImage(files []*multipart.FileHeader) ([]*models.Image, error)
}
