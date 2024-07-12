package repository

import (
	"mime/multipart"
)

type ImageRepository interface {
	CreateImage(files []*multipart.FileHeader) ([]string, error)
}
