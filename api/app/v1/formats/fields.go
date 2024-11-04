package formats

import "strings"

// prefix fields without .
func TrimPrefixFields(s string, prefix string) string {
	if s == prefix {
		return "*"
	}
	return strings.TrimPrefix(s, prefix+".")
}
