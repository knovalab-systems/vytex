package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func UserFields(s query.IUserDo, fieldsStr string) query.IUserDo {

	userTable := query.User
	fieldsArr := strings.Split(fieldsStr, ",")
	fields := []field.Expr{}
	roleFieldsArr := []string{}

	for _, v := range fieldsArr {

		if strings.HasPrefix(v, "role.") {
			roleFieldsArr = append(roleFieldsArr, strings.ReplaceAll(v, "role.", ""))
			continue
		}

		switch v {
		case "id":
			fields = append(fields, userTable.ID)
		case "username":
			fields = append(fields, userTable.Username)
		case "name":
			fields = append(fields, userTable.Name)
		case "password":
			fields = append(fields, userTable.Password)
		case "role_id":
			fields = append(fields, userTable.RoleId)
		case "role":
			fields = append(fields, userTable.RoleId)
			s = s.Preload(userTable.Role)
		case "deleted_at":
			fields = append(fields, userTable.DeletedAt)
		case "created_at":
			fields = append(fields, userTable.CreatedAt)
		case "updated_at":
			fields = append(fields, userTable.UpdatedAt)
		default:
			fields = append(fields, userTable.ALL)
		}
	}

	if len(roleFieldsArr) != 0 {
		fields = append(fields, userTable.RoleId)
		roleTables := query.Role
		roleFields := []field.Expr{roleTables.ID}

		for _, v := range roleFieldsArr {
			switch v {
			case "id":
				roleFields = append(roleFields, roleTables.ID)
			case "name":
				roleFields = append(roleFields, roleTables.Name)
			case "code":
				roleFields = append(roleFields, roleTables.Code)
			case "policies":
				roleFields = append(roleFields, roleTables.Policies)
			default:
				roleFields = append(roleFields, roleTables.ALL)
			}
		}
		s = s.Preload(userTable.Role.Select(roleFields...))
	}
	return s.Select(fields...)
}
