import { type SubmitHandler, createForm, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import type { CoreSchema, VytexComposition } from '@vytex/client';
import { For, Show } from 'solid-js';
import toast from 'solid-toast';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label, LabelSpan } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { STATUS_CODE } from '~/constants/http';
import { FABRICS_PATH } from '~/constants/paths';
import { type Colors, useColors } from '~/hooks/useColors';
import { type Suppliers, useSuppliers } from '~/hooks/useSuppliers';
import { COMPOSITIONS } from '~/schemas/compositions';
import type { Fabric } from '~/schemas/core';
import { createFabricRequest } from '../requests/fabricCreate';
import { FabricCreateSchema, type FabricCreateType } from '../schemas/fabricCreate';

function FabricCreateForm(props: {
	colors: Colors;
	suppliers: Suppliers;
}) {
	const { colorsRecord } = useColors();
	const { suppliersRecord } = useSuppliers();

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
			composition: composition as VytexComposition<CoreSchema>,
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
					toast.error('Error al crear tela');
				}
			});
	};

	const handleCancel = () => navigate(FABRICS_PATH);

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
									<Select
										class='whitespace-nowrap min-w-48'
										value={field.value}
										onChange={value => {
											setValue(form, 'color', value);
										}}
										placeholder='Selecciona un color'
										itemComponent={props => (
											<SelectItem item={props.item}>
												<div class='flex gap-2'>
													<div
														class='h-5 w-5 m-auto border'
														style={{ background: colorsRecord()[props.item.rawValue]?.hex || '' }}
													/>
													{colorsRecord()[props.item.rawValue]?.name}
												</div>
											</SelectItem>
										)}
										options={props.colors.map(color => color.id)}
									>
										<SelectTrigger title='Ver colores' aria-errormessage={field.error} aria-label='Colores'>
											<SelectValue<string>>
												{state => (
													<div class='flex gap-2'>
														<Show when={Boolean(colorsRecord()[state.selectedOption()])}>
															<div
																class='h-5 w-5 m-auto border'
																style={{ background: colorsRecord()[state.selectedOption()]?.hex || '' }}
															/>
														</Show>
														{colorsRecord()[state.selectedOption()]?.name || 'Selecciona un color'}
													</div>
												)}
											</SelectValue>
										</SelectTrigger>
										<Show when={Boolean(field.error)}>
											<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
										</Show>
										<SelectContent />
									</Select>
								</div>
							)}
						</Field>
						<Field name='supplier' type='number'>
							{field => (
								<div class='gap-4 w-full'>
									<LabelSpan class='my-auto whitespace-nowrap'>Proveedor de la tela</LabelSpan>
									<Select
										class='whitespace-nowrap min-w-48'
										value={field.value}
										onChange={value => {
											setValue(form, 'supplier', value);
										}}
										placeholder='Selecciona un proveedor'
										itemComponent={props => (
											<SelectItem item={props.item}>{suppliersRecord()[props.item.rawValue]?.name}</SelectItem>
										)}
										options={props.suppliers.map(supplier => supplier.id)}
									>
										<SelectTrigger title='Ver proveedores' aria-errormessage={field.error} aria-label='Proveedores'>
											<SelectValue<string>>
												{state => (
													<div>{suppliersRecord()[state.selectedOption()]?.name || 'Selecciona un proveedor'}</div>
												)}
											</SelectValue>
										</SelectTrigger>
										<Show when={Boolean(field.error)}>
											<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
										</Show>
										<SelectContent />
									</Select>
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
				<Button type='button' onclick={handleCancel} class='bg-red-500 hover:bg-red-600'>
					Cancelar
				</Button>
				<Button type='submit' disabled={form.submitting} class='bg-green-600 hover:bg-green-700'>
					Crear
				</Button>
			</div>
		</Form>
	);
}

export default FabricCreateForm;
