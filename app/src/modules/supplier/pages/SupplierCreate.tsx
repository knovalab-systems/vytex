import AllowRoles from '~/components/AllowRoles';
import SupplierCreateForm from '../components/SupplierCreateForm';

function SupplierCreate() {
	return (
		<AllowRoles roles={['admin']}>
			<SupplierCreatePage />
		</AllowRoles>
	);
}

function SupplierCreatePage() {
	return (
		<div class='flex items-center justify-center h-full'>
			<SupplierCreateForm />
		</div>
	);
}

export default SupplierCreate;
