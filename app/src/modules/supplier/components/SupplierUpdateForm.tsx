import { getLocalTimeZone, now } from '@internationalized/date';
import { type SubmitHandler, createForm, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';
import toast from 'solid-toast';
import CancelButton from '~/components/CancelButton';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label, LabelSpan } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { STATUS_CODE } from '~/constants/http';
import { SUPPLIERS_PATH } from '~/constants/paths';
import { STATUS_OPTIONS } from '~/constants/status';
import { refetchSuppliers } from '~/hooks/useSuppliers';
import type { Supplier } from '~/types/core';
import type { GetSupplierType } from '../requests/supplierGet';
import { updateSupplierRequest } from '../requests/supplierUpdate';
import { SupplierUpdateSchema, type SupplierUpdateType } from '../schemas/supplierUpdate';

function SupplireUpdateForm(props: { supplier?: GetSupplierType }) {
	const navigate = useNavigate();

	const [form, { Form, Field }] = createForm<SupplierUpdateType>({
		validate: valiForm(SupplierUpdateSchema),
		initialValues: {
			name: props.supplier?.name || '',
			brand: props.supplier?.brand || '',
			code: Number(props.supplier?.code),
			nit: Number(props.supplier?.nit),
			deleted_at: !props.supplier?.deleted_at ? 'Activo' : 'Inactivo',
		},
	});

	const handleSubmit: SubmitHandler<SupplierUpdateType> = async data => {
		const formData = {
			...data,
			code: String(data.code),
			nit: String(data.nit),
		};

		const { deleted_at, ...rest } = formData;
		const supplier: Supplier = Object.keys(rest).reduce((p: Omit<Supplier, 'id'>, v) => {
			const field = rest[v as keyof typeof rest];
			const oldField = props.supplier?.[v as keyof typeof props.supplier];
			if (field && field !== oldField) {
				p[v as keyof typeof p] = field;
			}
			return p;
		}, {});

		if (!STATUS_OPTIONS[deleted_at as keyof typeof STATUS_OPTIONS] && !props.supplier?.deleted_at) {
			supplier.deleted_at = now(getLocalTimeZone()).toAbsoluteString();
		} else if (STATUS_OPTIONS[deleted_at as keyof typeof STATUS_OPTIONS] && Boolean(props.supplier?.deleted_at)) {
			supplier.deleted_at = null;
		}

		return updateSupplierRequest(props.supplier?.id || 0, supplier)
			.then(() => {
				refetchSuppliers();
				toast.success('Proveedor actualizado correctamente.');
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
					toast.error('Error al actualizar proveedor.');
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
				<Field name='code' type='number'>
					{(field, props) => (
						<div>
							<Label for='code-field'>Código</Label>
							<Input
								placeholder='2322'
								autocomplete='off'
								type='number'
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
				<Field name='deleted_at'>
					{field => (
						<div>
							<LabelSpan>Estado</LabelSpan>
							<Select<string>
								value={field.value}
								onChange={value => {
									setValue(form, 'deleted_at', value);
								}}
								options={Object.keys(STATUS_OPTIONS)}
								placeholder='Selecciona un estado'
								itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
							>
								<SelectTrigger aria-label='Estado' title='Ver estados'>
									<SelectValue<string>>{state => state.selectedOption()}</SelectValue>
								</SelectTrigger>
								<SelectContent />
								<Show when={Boolean(field.error)}>
									<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
								</Show>
							</Select>
						</div>
					)}
				</Field>
			</div>
			<div class='flex justify-between m-4'>
				<CancelButton to={SUPPLIERS_PATH} />
				<Button type='submit' disabled={form.submitting || !form.dirty} variant='success'>
					Actualizar
				</Button>
			</div>
		</Form>
	);
}

export default SupplireUpdateForm;
