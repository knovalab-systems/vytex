import { type SubmitHandler, createForm, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { For, Show } from 'solid-js';
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
import { COMPOSITIONS } from '~/constants/compositions';
import { STATUS_CODE } from '~/constants/http';
import { FABRICS_PATH } from '~/constants/paths';
import { type Colors, useColors } from '~/hooks/useColors';
import { type Suppliers, useSuppliers } from '~/hooks/useSuppliers';
import type { Composition, Fabric } from '~/types/core';
import { createFabricRequest } from '../requests/fabricCreate';
import { FabricCreateSchema, type FabricCreateType } from '../schemas/fabricCreate';

function FabricCreateForm(props: { suppliers: Suppliers }) {
	const { getColorsRecord, getColors } = useColors();
	const { getSuppliersRecord: suppliersRecord } = useSuppliers();

	const navigate = useNavigate();
	const [form, { Form, Field }] = createForm<FabricCreateType>({
		validate: valiForm(FabricCreateSchema),
		initialValues: {
			composition: COMPOSITIONS.reduce((p: Record<string, number>, v) => {
				p[v] = 0;
				return p;
			}, {}),
		},
	});

	const handleSubmit: SubmitHandler<FabricCreateType> = async data => {
		const { composition, code, color, supplier, ...rest } = data;
		let totalComp = 0;
		for (const [k, v] of Object.entries(composition)) {
			const newV = Math.floor(v * 100);
			composition[k] = newV;
			totalComp += newV;
		}

		if (totalComp !== 10000) {
			return toast.error('Las composiciones deben sumar 100, revisa los valores.');
		}

		const fabric: Fabric = {
			...rest,
			code: code.toString(),
			color_id: color,
			supplier_id: supplier,
			composition: composition as Composition,
		};

		return createFabricRequest(fabric)
			.then(() => {
				toast.success('Tela creada correctamente');
				navigate(FABRICS_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El código de la tela "${data.code}" no está disponible. Intente con otro.`);
				} else {
					toast.error('Error al crear tela.');
				}
			});
	};

	return (
		<Form class='w-full lg:w-3/5 2xl:w-2/4' onSubmit={handleSubmit}>
			<div class='space-y-4 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
				<h1 class='text-2xl font-bold text-center'>Crear tela</h1>
				<div class='flex flex-col md:flex-row w-full gap-4'>
					<div class='w-full space-y-4'>
						<Field name='name'>
							{(field, props) => (
								<div>
									<Label for='name-field'>Nombre</Label>
									<Input
										placeholder='Tela'
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
									<Label for='cost-field'>Cost</Label>
									<Input
										type='number'
										placeholder='12000'
										autocomplete='off'
										step='.01'
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
									<LabelSpan class='my-auto whitespace-nowrap'>Color de la tela</LabelSpan>

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
										options={getColors().filter(e => !e.deleted_at)}
									>
										<ComboboxControl aria-errormessage={field.error} aria-label='Colores'>
											<div
												class='h-5 w-5 mr-2 m-auto border'
												style={{ background: getColorsRecord()[field.value || 0]?.hex || 'transparent' }}
											/>
											<ComboboxInput />
											<ComboboxTrigger title='Ver colores' aria-label='Colores' />
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
									<LabelSpan class='my-auto whitespace-nowrap'>Proveedor de la tela</LabelSpan>
									<Combobox<Suppliers[0]>
										class='whitespace-nowrap min-w-48'
										value={suppliersRecord()[field.value || 0] || null}
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
					<div class='grid grid-cols-2 gap-4'>
						<For each={COMPOSITIONS}>
							{e => (
								<Field name={`composition.${e}`} type='number'>
									{(field, props) => (
										<div>
											<Label for={`composition-field-${e}`}>{e.toUpperCase()}</Label>
											<Input
												type='number'
												placeholder='10'
												autocomplete='off'
												step='.01'
												id={`composition-field-${e}`}
												aria-errormessage={field.error}
												required
												value={field.value}
												{...props}
											/>
										</div>
									)}
								</Field>
							)}
						</For>
					</div>
				</div>
			</div>
			<div class='flex justify-between m-4'>
				<CancelButton to={FABRICS_PATH} />
				<Button type='submit' disabled={form.submitting} variant='success'>
					Crear
				</Button>
			</div>
		</Form>
	);
}

export default FabricCreateForm;
