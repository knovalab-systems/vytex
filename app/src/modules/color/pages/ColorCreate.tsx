import AllowPolicies from '~/components/AllowPolicies';
import ColorCreateForm from '../components/ColorCreateForm';

function ColorCreate() {
	return (
		<AllowPolicies policies={['CreateColors']}>
			<ColorCreatepage />
		</AllowPolicies>
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
