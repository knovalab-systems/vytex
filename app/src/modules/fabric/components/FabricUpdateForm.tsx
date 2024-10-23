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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { COMPOSITIONS } from '~/constants/compositions';
import { STATUS_CODE } from '~/constants/http';
import { FABRICS_PATH } from '~/constants/paths';
import { STATUS_VALUES } from '~/constants/status';
import { type Colors, useColors } from '~/hooks/useColors';
import { type Suppliers, useSuppliers } from '~/hooks/useSuppliers';
import type { Composition, Fabric } from '~/types/core';
import type { GetFabricType } from '../requests/fabricGet';
import { updateFabricRequest } from '../requests/fabricUpdate';
import { FabricUpdateSchema, type FabricUpdateType } from '../schemas/fabricUpdate';

function FabricUpdateForm(props: { fabric?: GetFabricType }) {
	const { getColorsRecord, getColors } = useColors();
	const { getSuppliersRecord, getSuppliers } = useSuppliers();

	const navigate = useNavigate();
	const [form, { Form, Field }] = createForm<FabricUpdateType>({
		validate: valiForm(FabricUpdateSchema),
		initialValues: {
			name: props.fabric?.name || '',
			supplier: props.fabric?.supplier_id || undefined,
			color: props.fabric?.color_id || undefined,
			cost: props.fabric?.cost || 0,
			deleted_at: !props.fabric?.deleted_at ? 'Activo' : 'Inactivo',
			code: props.fabric?.code || '',
			composition: COMPOSITIONS.reduce((p: Record<string, number>, v) => {
				p[v] = 0;
				if (props.fabric?.composition?.[v as keyof typeof props.fabric.composition]) {
					p[v] = props.fabric?.composition?.[v as keyof typeof props.fabric.composition] / 100;
				}
				return p;
			}, {}),
		},
	});

	const handleSubmit: SubmitHandler<FabricUpdateType> = async data => {
		const { code, color, supplier, deleted_at, composition, ...restData } = data;

		const formData = {
			...restData,
			code: code,
			color_id: color,
			supplier_id: supplier,
		};

		const fabric = Object.keys(formData).reduce((p: Omit<Fabric, 'id' | 'color' | 'supplier'>, v) => {
			const field = formData[v as keyof typeof formData];
			const oldField = props.fabric?.[v as keyof typeof props.fabric];
			if (field !== undefined && field !== oldField) {
				// @ts-ignore: type is corresponding
				p[v as keyof typeof p] = field;
			}
			return p;
		}, {});

		const isDeleted = Boolean(props.fabric?.deleted_at);

		if (deleted_at === 'Inactivo' && !isDeleted) {
			fabric.deleted_at = new Date().toISOString();
		} else if (deleted_at === 'Activo' && isDeleted) {
			fabric.deleted_at = null;
		}

		let totalComp = 0;
		let change = false;

		for (const [k, v] of Object.entries(composition)) {
			const newV = Math.floor(v * 100);
			if (newV !== (props.fabric?.composition?.[k as keyof typeof props.fabric.composition] || 0)) change = true;
			composition[k] = newV;
			totalComp += newV;
		}

		if (change) {
			fabric.composition = composition as Composition;
		}

		if (totalComp !== 10000) {
			return toast.error('Las composiciones deben sumar 100, revisa los valores.');
		}

		return updateFabricRequest(props.fabric?.id || 0, fabric)
			.then(() => {
				toast.success('Tela actualizado correctamente.');
				navigate(FABRICS_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El código de la tela "${code}" no está disponible. Intente con otro.`);
				} else {
					toast.error('Error al actualizar la tela.');
				}
			});
	};

	return (
		<Form class='w-full lg:w-3/5 2xl:w-2/4' onSubmit={handleSubmit}>
			<div class='space-y-4 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
				<h1 class='text-2xl font-bold text-center'>Actualizar tela</h1>
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
						<Field name='code'>
							{(field, props) => (
								<div>
									<Label for='code-field'>Código</Label>
									<Input
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
									<LabelSpan class='my-auto whitespace-nowrap'>Proveedor de la tela</LabelSpan>
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
			<div class='flex justify-between m-4'>
				<CancelButton to={FABRICS_PATH} />
				<Button type='submit' disabled={form.submitting || !form.dirty} variant='success'>
					Actualizar
				</Button>
			</div>
		</Form>
	);
}

export default FabricUpdateForm;
