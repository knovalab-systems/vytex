import AllowPolicies from '~/components/AllowPolicies';
import RoleCreateForm from '../components/RoleCreateForm';

function RoleCreate() {
	return (
		<AllowPolicies policies={['CreateRoles']}>
			<RoleCreatePage />
		</AllowPolicies>
	);
}

function RoleCreatePage() {
	return (
		<div class='flex items-center justify-center h-full'>
			<RoleCreateForm />
		</div>
	);
}

export default RoleCreate;
