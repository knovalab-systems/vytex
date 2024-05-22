import { lazy } from 'solid-js';

const CreateForm = lazy(() => import('../components/CreateForm'));

function UserCreatePage() {
	return (
		<div class='flex items-center justify-center h-full'>
			<CreateForm />
		</div>
	);
}

export default UserCreatePage;
