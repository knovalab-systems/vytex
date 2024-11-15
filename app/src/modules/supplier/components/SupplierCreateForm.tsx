import { type SubmitHandler, createForm, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import toast from 'solid-toast';
import CancelButton from '~/components/CancelButton';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { STATUS_CODE } from '~/constants/http';
import { SUPPLIERS_PATH } from '~/constants/paths';
import { refetchSuppliers } from '~/hooks/useSuppliers';
import { createSupplierRequest } from '../requests/supplierCreate';
import { SupplierCreateSchema, type SupplierCreateType } from '../schemas/supplierCreate';

function SupplierCreateForm() {
	const navigate = useNavigate();

	const [form, { Form, Field }] = createForm<SupplierCreateType>({
		validate: valiForm(SupplierCreateSchema),
	});

	const handleSubmit: SubmitHandler<SupplierCreateType> = async data => {
		const supplier = { ...data, code: data.code, nit: String(data.nit) };
		return createSupplierRequest(supplier)
			.then(() => {
				refetchSuppliers();
				toast.success('Proveedor creado correctamente');
				navigate(SUPPLIERS_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					switch (error.errors.detail) {
						case 'Supplier code already exists':
							toast.error(`El código "${data.code}" no está disponible. Intente con otro.`);
							break;
						case 'Supplier NIT already exists':
							toast.error(`El NIT "${data.nit}" no está disponible. Intente con otro.`);
							break;
						default:
							toast.error(`El NIT "${data.nit}" y el código "${data.code}" no están disponibles. Intente con otros.`);
							break;
					}
				} else {
					toast.error('Error al crear proveedor.');
				}
			});
	};

	return (
		<Form class='w-full lg:w-2/5 2xl:w-1/4' onSubmit={handleSubmit}>
			<div class='flex flex-col justify-center gap-4 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
				<h1 class='text-2xl font-bold text-center'>Crear proveedor</h1>
				<Field name='name'>
					{(field, props) => (
						<div>
							<Label for='name-field'>Nombre</Label>
							<Input
								placeholder='Nombre del proveedor'
								autocomplete='off'
								id='name-field'
								aria-errormessage={field.error}
								required
								value={field.value}
								{...props}
							/>
						</div>
					)}
				</Field>
				<Field name='brand'>
					{(field, props) => (
						<div>
							<Label for='brand-field'>Marca</Label>
							<Input
								placeholder='Marca del proveedor'
								autocomplete='off'
								id='brand-field'
								aria-errormessage={field.error}
								required
								value={field.value}
								{...props}
							/>
						</div>
					)}
				</Field>
				<Field name='code'>
					{(field, props) => (
						<div>
							<Label for='code-field'>Código</Label>
							<Input
								placeholder='2322'
								autocomplete='off'
								id='code-field'
								aria-errormessage={field.error}
								required
								value={field.value}
								{...props}
							/>
						</div>
					)}
				</Field>
				<Field name='nit' type='number'>
					{(field, props) => (
						<div>
							<Label for='nit-field'>NIT</Label>
							<Input
								placeholder='111111111'
								autocomplete='off'
								type='number'
								id='nit-field'
								aria-errormessage={field.error}
								required
								value={field.value}
								{...props}
							/>
						</div>
					)}
				</Field>
			</div>
			<div class='flex justify-between m-4'>
				<CancelButton to={SUPPLIERS_PATH} />
				<Button type='submit' disabled={form.submitting} variant='success'>
					Crear
				</Button>
			</div>
		</Form>
	);
}

export default SupplierCreateForm;
