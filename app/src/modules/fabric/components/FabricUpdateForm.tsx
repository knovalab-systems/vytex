import type { Colors } from '~/hooks/useColors';
import type { Suppliers } from '~/hooks/useSuppliers';
import type { GetFabricType } from '../requests/fabricGet';

function FabricUpdateForm(props: {
	colors: Colors;
	suppliers: Suppliers;
	fabric?: GetFabricType;
}) {
	return (
		<div>
			<h2>FabricUpdateForm</h2>
		</div>
	);
}

export default FabricUpdateForm;
