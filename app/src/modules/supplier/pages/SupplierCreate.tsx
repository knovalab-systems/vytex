import AllowPolicies from '~/components/AllowPolicies';
import SupplierCreateForm from '../components/SupplierCreateForm';

function SupplierCreate() {
	return (
		<AllowPolicies policies={['CreateSuppliers']}>
			<SupplierCreatePage />
		</AllowPolicies>
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
