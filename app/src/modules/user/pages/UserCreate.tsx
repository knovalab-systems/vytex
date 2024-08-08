import AllowRoles from '~/components/AllowRoles';
import UserCreateForm from '../components/UserCreateForm';

function UserCreate() {
	return (
		<AllowRoles roles={['admin']}>
			<UserCreatePage />
		</AllowRoles>
	);
}

function UserCreatePage() {
	return (
		<div class='flex items-center justify-center h-full'>
			<UserCreateForm />
		</div>
	);
}

export default UserCreate;
