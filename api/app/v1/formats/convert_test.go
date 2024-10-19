package formats

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestConvertInterface(t *testing.T) {

	t.Run("convert string", func(t *testing.T) {
		var b interface{} = "2312"

		res, err := ConvertInterface[string](b)

		if assert.NoError(t, err) {
			assert.Equal(t, res, "2312")
		}
	})

	t.Run("convert int", func(t *testing.T) {
		var b interface{} = 321321

		res, err := ConvertInterface[int](b)

		if assert.NoError(t, err) {
			assert.Equal(t, res, 321321)
		}
	})

	t.Run("convert bool", func(t *testing.T) {
		var b interface{} = true

		res, err := ConvertInterface[bool](b)

		if assert.NoError(t, err) {
			assert.Equal(t, res, true)
		}
	})

	t.Run("fail convert int", func(t *testing.T) {
		var b interface{} = ""

		_, err := ConvertInterface[int](b)

		if assert.Error(t, err) {
			assert.Equal(t, err, errors.New("INVALID CONVERSION"))
		}
	})

}

func TestConvertToNumber(t *testing.T) {

	t.Run("convert float64", func(t *testing.T) {
		var b interface{} = 32.32

		res, err := ConvertToNumber[float64](b)

		if assert.NoError(t, err) {
			assert.Equal(t, res, 32.32)
		}
	})

	t.Run("convert uint", func(t *testing.T) {
		var b interface{} = 32.32

		res, err := ConvertToNumber[uint](b)

		if assert.NoError(t, err) {
			assert.Equal(t, res, uint(32))
		}
	})

}

func TestConvertToTime(t *testing.T) {

	t.Run("convert timeT", func(t *testing.T) {
		var b interface{} = "2024-10-18T04:59:59.999Z"

		res, err := ConvertToTime(b)

		if assert.NoError(t, err) {
			assert.Equal(t, res.Year(), 2024)
			assert.Equal(t, res.Month().String(), "October")
			assert.Equal(t, res.Day(), 18)
		}
	})

}

func TestConvertSlice(t *testing.T) {

	t.Run("convert string", func(t *testing.T) {
		var b []interface{} = []interface{}{"2312", "23421"}

		res, err := ConvertSlice[string](b)

		if assert.NoError(t, err) {
			assert.Equal(t, len(res), 2)
			assert.Equal(t, res[1], "23421")
		}
	})

	t.Run("convert int", func(t *testing.T) {
		var b []interface{} = []interface{}{2312, 23421}

		res, err := ConvertSlice[int](b)

		if assert.NoError(t, err) {
			assert.Equal(t, len(res), 2)
			assert.Equal(t, res[1], 23421)
		}
	})

	t.Run("convert bool", func(t *testing.T) {
		var b []interface{} = []interface{}{true, false}

		res, err := ConvertSlice[bool](b)

		if assert.NoError(t, err) {
			assert.Equal(t, len(res), 2)
			assert.Equal(t, res[0], true)
		}
	})

}
