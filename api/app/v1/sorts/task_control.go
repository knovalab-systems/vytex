package sorts

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
)

func TaskControlSorts(s query.ITaskControlDo, sorts string) query.ITaskControlDo {
	table := query.TaskControl

	sortFields := strings.Split(sorts, ",")
	for _, field := range sortFields {
		field = strings.TrimSpace(field)

		descending := false
		if strings.HasPrefix(field, "-") {
			descending = true
			field = strings.TrimPrefix(field, "-")
		}

		switch field {
		case "created_at":
			if descending {
				s.Order(table.ID.Desc())
			} else {
				s.Order(table.ID.Asc())
			}
		case "started_at":
			if descending {
				s.Order(table.StartedAt.Desc())
			} else {
				s.Order(table.StartedAt.Asc())
			}
		case "finished_at":
			if descending {
				s.Order(table.FinishedAt.Desc())
			} else {
				s.Order(table.FinishedAt.Asc())
			}
		case "rejected_at":
			if descending {
				s.Order(table.RejectedAt.Desc())
			} else {
				s.Order(table.RejectedAt.Asc())
			}

		}
	}

	return s
}
