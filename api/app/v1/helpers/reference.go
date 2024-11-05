package helpers

import (
	"archive/zip"
	"bytes"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gorm"
)

func CheckReferenceExists(code string) error {
	t := query.Reference

	_, err := t.Unscoped().Where(t.Code.Eq(code)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return problems.ServerError()
	}
	return problems.ReferenceExists()
}

func CreateZip(imagePaths []string) ([]byte, error) {
	buf := new(bytes.Buffer)
	zipWriter := zip.NewWriter(buf)

	for i, path := range imagePaths {
		var baseName string
		switch i {
		case 0:
			baseName = "front_image"
		case 1:
			baseName = "back_image"
		default:
			baseName = fmt.Sprintf("piece_%d", i-1)
		}

		if err := addFileToZip(zipWriter, path, baseName); err != nil {
			return nil, err
		}
	}

	if err := zipWriter.Close(); err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

func addFileToZip(zipWriter *zip.Writer, filePath, baseName string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	content, err := io.ReadAll(file)
	if err != nil {
		return err
	}

	extension := filepath.Ext(filePath)
	fileName := baseName + extension

	writer, err := zipWriter.Create(fileName)
	if err != nil {
		return err
	}

	_, err = writer.Write(content)
	return err
}
