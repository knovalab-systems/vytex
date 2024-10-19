package formats

import (
	"errors"
	"time"
)

// Just for handle error
func ConvertInterface[E any](in any) (out E, err error) {
	out, ok := in.(E)
	if !ok {
		err = errors.New("INVALID CONVERSION")
	}
	return
}

func ConvertToNumber[E float64 | uint](in any) (out E, err error) {
	num, err := ConvertInterface[float64](in)
	if err != nil {
		return
	}

	return E(num), nil
}

func ConvertToTime(in any) (out time.Time, err error) {
	str, err := ConvertInterface[string](in)
	if err != nil {
		return
	}

	out, err = time.Parse(time.RFC3339, str)
	return
}

func ConvertSliceInterface[E any](in any) (out []E, err error) {
	value, err := ConvertInterface[[]any](in)
	if err != nil {
		return
	}

	out, err = ConvertSlice[E](value)
	return
}

func ConvertSlice[E any](in []any) (out []E, err error) {
	out = make([]E, 0, len(in))
	for _, v := range in {
		value, err := ConvertInterface[E](v)
		if err != nil {
			return nil, err
		}
		out = append(out, value)
	}
	return
}

func ConvertSliceNumberInterface[E float64 | uint](in any) (out []E, err error) {
	value, err := ConvertInterface[[]any](in)
	if err != nil {
		return
	}

	out, err = ConvertSliceNumber[E](value)
	return
}

func ConvertSliceNumber[E float64 | uint](in []any) (out []E, err error) {
	out = make([]E, 0, len(in))
	for _, v := range in {
		value, err := ConvertToNumber[E](v)
		if err != nil {
			return nil, err
		}
		out = append(out, value)
	}
	return
}

func ConvertSliceTimeInterface(in any) (out []time.Time, err error) {
	value, err := ConvertInterface[[]any](in)

	if err != nil {
		return
	}

	out, err = ConvertSliceTime(value)
	return
}

func ConvertSliceTime(in []any) (out []time.Time, err error) {
	out = make([]time.Time, 0, len(in))
	for _, v := range in {
		date, err := ConvertToTime(v)
		if err != nil {
			return nil, err
		}
		out = append(out, date)
	}
	return
}
