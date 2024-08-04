import AllowRoles from '~/components/AllowRoles';
import ColorCreateForm from '../components/ColorCreateForm';

function ColorCreate() {
	return (
		<AllowRoles roles={['designer']}>
			<ColorCreatepage />
		</AllowRoles>
	);
}

function ColorCreatepage() {
	return (
		<div class='flex items-center justify-center h-full'>
			<ColorCreateForm />
		</div>
	);
}

export default ColorCreate;
