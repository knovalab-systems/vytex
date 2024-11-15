import { type SubmitHandler, createForm, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';
import toast from 'solid-toast';
import CancelButton from '~/components/CancelButton';
import { Button } from '~/components/ui/Button';
import {
	Combobox,
	ComboboxContent,
	ComboboxControl,
	ComboboxInput,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxItemLabel,
	ComboboxTrigger,
} from '~/components/ui/Combobox';
import { Input } from '~/components/ui/Input';
import { Label, LabelSpan } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { STATUS_CODE } from '~/constants/http';
import { RESOURCES_PATH } from '~/constants/paths';
import { STATUS_VALUES } from '~/constants/status';
import { type Colors, useColors } from '~/hooks/useColors';
import { type Suppliers, useSuppliers } from '~/hooks/useSuppliers';
import type { Resource } from '~/types/core';
import type { GetResourceType } from '../requests/resourceGet';
import { updateResourceRequest } from '../requests/resourceUpdate';
import { ResourceUpdateSchema, type ResourceUpdateType } from '../schema/resourceUpdate';

function ResourceUpdateForm(props: { resource?: GetResourceType }) {
	const { getColorsRecord, getColors } = useColors();
	const { getSuppliersRecord, getSuppliers } = useSuppliers();

	const navigate = useNavigate();

	const [form, { Form, Field }] = createForm<ResourceUpdateType>({
		validate: valiForm(ResourceUpdateSchema),
		initialValues: {
			name: props.resource?.name || '',
			code: props.resource?.code || '',
			cost: Number(props.resource?.cost),
			color: props.resource?.color_id || 0,
			supplier: props.resource?.supplier_id || 0,
			deleted_at: !props.resource?.deleted_at ? 'Activo' : 'Inactivo',
		},
	});

	const handleSubmit: SubmitHandler<ResourceUpdateType> = async data => {
		const { code, color, supplier, deleted_at, ...restData } = data;

		const formData = {
			...restData,
			code: code,
			color_id: color,
			supplier_id: supplier,
		};

		const resource = Object.keys(formData).reduce((p: Omit<Resource, 'id' | 'color' | 'supplier'>, v) => {
			const field = formData[v as keyof typeof formData];
			const oldField = props.resource?.[v as keyof typeof props.resource];
			if (field !== undefined && field !== oldField) {
				// @ts-ignore: type is corresponding
				p[v as keyof typeof p] = field;
			}
			return p;
		}, {});

		const isDeleted = Boolean(props.resource?.deleted_at);

		if (deleted_at === 'Inactivo' && !isDeleted) {
			resource.deleted_at = new Date().toISOString();
		} else if (deleted_at === 'Activo' && isDeleted) {
			resource.deleted_at = null;
		}

		return updateResourceRequest(props.resource?.id || 0, resource)
			.then(() => {
				toast.success('Insumo actualizado correctamente.');
				navigate(RESOURCES_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El código del insumo "${code}" no está disponible. Intente con otro.`);
				} else {
					toast.error('Error al actualizar el insumo.');
				}
			});
	};

	return (
		<Form class='w-full lg:w-3/5 xl:w-2/6' onSubmit={handleSubmit}>
			<div class='space-y-4 p-8 m-4 bg-white rounded-md border-gray-100 shadow-md'>
				<h1 class='text-2xl font-bold text-center'>Crear Insumo</h1>
				<div class='w-full space-y-4'>
					<Field name='name'>
						{(field, props) => (
							<div>
								<Label for='name-field'>Nombre</Label>
								<Input
									placeholder='Insumo'
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
					<Field name='cost' type='number'>
						{(field, props) => (
							<div>
								<Label for='cost-field'>Costo</Label>
								<Input
									type='number'
									placeholder='12000'
									autocomplete='off'
									id='cost-field'
									aria-errormessage={field.error}
									required
									value={field.value}
									{...props}
								/>
							</div>
						)}
					</Field>
					<Field name='color' type='number'>
						{field => (
							<div class='gap-4 w-full'>
								<LabelSpan class='my-auto whitespace-nowrap'>Color del insumo</LabelSpan>
								<Combobox<Colors[0]>
									class='whitespace-nowrap min-w-48'
									value={getColorsRecord()[field.value || 0] || null}
									onChange={value => {
										setValue(form, 'color', value ? value.id : 0);
									}}
									onInputChange={value => {
										if (value === '') {
											setValue(form, 'color', 0);
										}
									}}
									multiple={false}
									optionLabel='name'
									optionValue='id'
									placeholder='Selecciona o escribe un color'
									itemComponent={props => (
										<ComboboxItem item={props.item}>
											<div class='flex gap-2'>
												<div class='h-5 w-5 m-auto border' style={{ background: props.item.rawValue.hex || '' }} />
												<ComboboxItemLabel>{props.item.rawValue.name}</ComboboxItemLabel>
											</div>
											<ComboboxItemIndicator />
										</ComboboxItem>
									)}
									options={getColors().filter(color => !color.deleted_at)}
								>
									<ComboboxControl<Colors[0]> aria-errormessage={field.error} aria-label='Colores'>
										{state => (
											<>
												<div
													class='h-5 w-5 mr-2 m-auto border'
													style={{ background: state.selectedOptions().at(0)?.hex || '' }}
												/>
												<ComboboxInput />
												<ComboboxTrigger title='Ver colores' aria-label='Colores' />
											</>
										)}
									</ComboboxControl>
									<Show when={Boolean(field.error)}>
										<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
									</Show>
									<ComboboxContent />
								</Combobox>
							</div>
						)}
					</Field>
					<Field name='supplier' type='number'>
						{field => (
							<div class='gap-4 w-full'>
								<LabelSpan class='my-auto whitespace-nowrap'>Proveedor del insumo</LabelSpan>
								<Combobox<Suppliers[0]>
									class='whitespace-nowrap min-w-48'
									value={getSuppliersRecord()[field.value || 0] || null}
									onChange={value => {
										setValue(form, 'supplier', value ? value.id : 0);
									}}
									onInputChange={value => {
										if (value === '') {
											setValue(form, 'supplier', 0);
										}
									}}
									multiple={false}
									optionLabel='name'
									optionValue='id'
									placeholder='Selecciona o escribe un proveedor'
									itemComponent={props => (
										<ComboboxItem item={props.item}>
											<ComboboxItemLabel>{props.item.rawValue.name}</ComboboxItemLabel>
											<ComboboxItemIndicator />
										</ComboboxItem>
									)}
									options={getSuppliers().filter(e => !e.deleted_at)}
								>
									<ComboboxControl aria-errormessage={field.error} aria-label='Proveedores'>
										<ComboboxInput />
										<ComboboxTrigger title='Ver proveedores' />
									</ComboboxControl>
									<Show when={Boolean(field.error)}>
										<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
									</Show>
									<ComboboxContent />
								</Combobox>
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
									options={STATUS_VALUES}
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
			</div>
			<div class='flex justify-between m-4'>
				<CancelButton to={RESOURCES_PATH} />
				<Button type='submit' disabled={form.submitting || !form.dirty} variant='success'>
					Actualizar
				</Button>
			</div>
		</Form>
	);
}

export default ResourceUpdateForm;
