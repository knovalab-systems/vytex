import AllowPolicies from '~/components/AllowPolicies';
import { permissions } from '~/constants/permissions';
import { roleList, rolePermissions } from '~/constants/roles';
import RoleTable from '../components/RoleTable';

function Roles() {
	return (
		<AllowPolicies policies={[]}>
			<RolesPage />
		</AllowPolicies>
	);
}

function RolesPage() {
	return (
		<div class='h-full'>
			<RoleTable roles={roleList} rolePermmissions={rolePermissions} permissions={Object.values(permissions)} />
			<span class='text-gray-500 text-sm'>Tener permiso a una función incluye acceder a la interfaz necesaria.</span>
		</div>
	);
}

export default Roles;
