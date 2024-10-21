package aggregate

const SubfixCount string = "count_"

func AdjustSubfix(a *[]map[string]interface{}, count []string) {
	countLenIsOne := len(count) == 1

	for _, v := range *a {

		if countLenIsOne {
			as := SubfixCount + count[0]
			value, exists := v[as]
			if exists {
				delete(v, as)
				v["count"] = value
			}
		} else {
			countMap := map[string]interface{}{}
			for _, c := range count {
				as := SubfixCount + c
				value, exists := v[as]
				if exists {
					delete(v, as)
					countMap[c] = value
				}
			}
			v["count"] = countMap
		}
	}

}
