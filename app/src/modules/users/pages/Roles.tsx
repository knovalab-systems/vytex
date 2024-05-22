import { roleList, rolePermissions } from '~/utils/roles';
import RoleTable from '../components/RoleTable';
import { permissions } from '~/utils/permissions';

function Roles() {
	return (
		<div>
			<RoleTable roles={roleList} rolePermmissions={rolePermissions} permissions={Object.values(permissions)} />
		</div>
	);
}

export default Roles;
