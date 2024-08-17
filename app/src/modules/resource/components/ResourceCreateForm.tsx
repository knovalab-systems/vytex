import { type SubmitHandler, createForm, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { Show } from 'solid-js';
import toast from 'solid-toast';
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
import { STATUS_CODE } from '~/constants/http';
import { RESOURCES_PATH } from '~/constants/paths';
import { type Colors, useColors } from '~/hooks/useColors';
import { type Suppliers, useSuppliers } from '~/hooks/useSuppliers';
import type { Resource } from '~/schemas/core';
import { createResourceRequest } from '../requests/resourceCreate';
import { ResourceCreateSchema, type ResourceCreateType } from '../schema/resourceCreate';

function ResourceCreateForm(props: {
	colors: Colors;
	suppliers: Suppliers;
}) {
	const { colorsRecord } = useColors();
	const { suppliersRecord } = useSuppliers();

	const navigate = useNavigate();

	const [form, { Form, Field }] = createForm<ResourceCreateType>({
		validate: valiForm(ResourceCreateSchema),
	});

	const handleSubmit: SubmitHandler<ResourceCreateType> = async data => {
		const { code, color, supplier, ...rest } = data;

		const resource: Resource = {
			...rest,
			code: code.toString(),
			color_id: color,
			supplier_id: supplier,
		};

		return createResourceRequest(resource)
			.then(() => {
				toast.success('Insumo creado correctamente');
				navigate(RESOURCES_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El código del insumo "${data.code}" no está disponible. Intente con otro.`);
				} else {
					toast.error('Error al crear insumo');
				}
			});
	};

	const handleCancel = () => navigate(RESOURCES_PATH);

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
					<Field name='code' type='number'>
						{(field, props) => (
							<div>
								<Label for='code-field'>Código</Label>
								<Input
									type='number'
									placeholder='23231'
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
									value={colorsRecord()[field.value || 0] || null}
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
									options={props.colors.filter(color => !color.deleted_at)}
								>
									<ComboboxControl aria-errormessage={field.error} aria-label='Colores'>
										<Show when={Boolean(colorsRecord()[field.value || 0])}>
											<div
												class='h-5 w-5 mr-2 m-auto border'
												style={{ background: colorsRecord()[field.value || 0]?.hex || '' }}
											/>
										</Show>
										<ComboboxInput />
										<ComboboxTrigger title='Ver colores' aria-label='Colores' />
									</ComboboxControl>
									<Show when={Boolean(field.error)}>
										<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
									</Show>
									<ComboboxContent />
								</Combobox>

								<Field name='supplier' type='number'>
									{field => (
										<div class='gap-4 w-full'>
											<LabelSpan class='my-auto whitespace-nowrap'>Proveedor del insumo</LabelSpan>
											<Combobox<Suppliers[0]>
												class='whitespace-nowrap min-w-48'
												value={suppliersRecord()[field.value || 0]}
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
												options={props.suppliers}
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
							</div>
						)}
					</Field>
				</div>
			</div>
			<div class='flex justify-between m-4'>
				<Button type='button' onclick={handleCancel} class='bg-red-500 hover:bg-red-600'>
					Cancelar
				</Button>
				<Button type='submit' class='bg-green-500 hover:bg-green-600'>
					Crear
				</Button>
			</div>
		</Form>
	);
}

export default ResourceCreateForm;
