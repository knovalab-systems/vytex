package formats

import (
	"strconv"
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/models"
)

func PoliciesToString(p []models.Policie) string {
	var s []string
	for _, num := range p {
		s = append(s, strconv.FormatInt((int64)(num), 10))
	}
	return strings.Join(s, ",")
}
