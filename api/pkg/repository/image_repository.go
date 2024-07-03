package repository

import (
	"mime/multipart"
)

type ImageRepository interface {
	CreateImage(file *multipart.FileHeader) (string, error)
}
