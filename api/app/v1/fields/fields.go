package fields

import "strings"

// check preload fields base on prefix, add to arr if is true
func PreloadFields(s string, prefix string, arr *[]string) bool {

	if arr == nil {
		return false
	}

	if s == prefix {
		*arr = append(*arr, "*")
		return true
	}

	preload := prefix + "."

	if strings.HasPrefix(s, preload) {
		*arr = append(*arr, strings.TrimPrefix(s, preload))
		return true

	}

	return false
}
