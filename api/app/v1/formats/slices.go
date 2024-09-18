package formats

func ConvertSlice[E any](in []any) (out []E) {
	out = make([]E, 0, len(in))
	for _, v := range in {
		out = append(out, v.(E))
	}
	return
}

// just for use in json
func ConvertSliceUint(in []any) (out []uint) {
	out = make([]uint, 0, len(in))
	for _, v := range in {
		out = append(out, uint(v.(float64)))
	}
	return
}
