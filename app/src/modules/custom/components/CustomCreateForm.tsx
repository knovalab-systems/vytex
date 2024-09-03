import { type SubmitHandler, createForm, insert, remove, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import type { VytexSize } from '@vytex/client';
import { FiPlus, FiTrash2 } from 'solid-icons/fi';
import { For, Show, createMemo } from 'solid-js';
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
import { Label } from '~/components/ui/Label';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { CUSTOMS_PATH } from '~/constants/paths';
import { DEFAULT_SIZES, SIZES } from '~/constants/sizes';
import { useColors } from '~/hooks/useColors';
import type { Custom } from '~/types/core';
import { type RefByCustomCreate, createCustomRequest } from '../requests/CustomCreate';
import { CustomCreateSchema, type CustomCreateType } from '../schemas/customCreate';

type ColorReference = {
	colorName: string;
	id: number;
	code: string;
	hex: string;
};

function CustomCreateForm(props: {
	references: RefByCustomCreate;
}) {
	const { colorsRecord } = useColors();
	const colorRerences = createMemo(() => {
		const arr: ColorReference[] = props.references.reduce((p: ColorReference[], v) => {
			const colors: ColorReference[] =
				v.colors?.map(c => {
					const color = () => colorsRecord()[c.color_id as number] || {};
					return {
						colorName: color().name || '',
						hex: color().hex || '',
						code: v.code || '',
						id: c.id,
					};
				}) || [];
			p.push(...colors);
			return p;
		}, []);

		const obj = arr.reduce((p: Record<number, ColorReference>, v) => {
			p[v.id] = v;
			return p;
		}, {});

		return { arr, obj };
	});
	const navigate = useNavigate();
	const [form, { Form, Field, FieldArray }] = createForm<CustomCreateType>({
		validate: valiForm(CustomCreateSchema),
		initialValues: {
			orders: [
				{
					sizes: DEFAULT_SIZES,
				},
			],
		},
	});

	const handleSubmit: SubmitHandler<CustomCreateType> = data => {
		const orders = [];
		for (let index = 0; index < data.orders.length; index++) {
			const order = data.orders[index];
			const sizes = order.sizes;
			if (Object.values(sizes).every(size => size === 0)) {
				return toast.error('Cada referencia debe tener almenos una talla con un valor mayor a 0.');
			}
			orders.push({ ...(sizes as VytexSize), color_by_reference_id: order.colorByRef });
		}

		const custom: Custom = {
			client: data.client,
			orders: orders,
		};

		return createCustomRequest(custom)
			.then(() => {
				toast.success('Pedido creado correctamente.');
				navigate(CUSTOMS_PATH);
			})
			.catch(() => {
				toast.error('Error al crear el pedido.');
			});
	};

	const handleCancel = () => navigate(CUSTOMS_PATH);

	return (
		<Form class='w-full lg:w-5/6 2xl:w-4/5' onSubmit={handleSubmit}>
			<div class='space-y-4 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
				<h1 class='text-2xl font-bold text-center'>Crear pedido</h1>
				<div class='w-full space-y-4'>
					<Field name='client'>
						{(field, props) => (
							<div>
								<Label for='client-field'>Cliente</Label>
								<Input
									placeholder='Nombre del cliente'
									autocomplete='off'
									id='client-field'
									aria-errormessage={field.error}
									required
									value={field.value}
									{...props}
								/>
							</div>
						)}
					</Field>
					<FieldArray name='orders'>
						{fieldOrders => (
							<>
								<TableContainer class='border lg:max-h-[40vh] overflow-auto '>
									<Table>
										<TableHeader>
											<TableRow class='*:text-center *:p-2'>
												<TableHead class=' 2xl:w-1/8'>Referencia</TableHead>
												<For each={SIZES}>{size => <TableHead class='min-w-16'>{size}</TableHead>}</For>
												<TableHead class='p-0'>Remover</TableHead>
											</TableRow>
										</TableHeader>
										<For each={fieldOrders.items}>
											{(_, i) => (
												<TableBody>
													<TableRow class='*:p-2'>
														<Field name={`${fieldOrders.name}.${i()}.colorByRef`} type='number'>
															{field => (
																<TableCell>
																	<Combobox<ColorReference>
																		class='whitespace-nowrap min-w-48'
																		value={colorRerences().obj[field.value || 0] || null}
																		onChange={value => {
																			setValue(form, `${fieldOrders.name}.${i()}.colorByRef`, value ? value.id : 0);
																		}}
																		onInputChange={value => {
																			if (value === '') {
																				setValue(form, `${fieldOrders.name}.${i()}.colorByRef`, 0);
																			}
																		}}
																		multiple={false}
																		optionLabel='code'
																		optionValue='id'
																		placeholder='Selecciona o escribe una rerefencia'
																		itemComponent={props => (
																			<ComboboxItem item={props.item}>
																				<div class='flex gap-2'>
																					<div
																						class='h-5 w-5 m-auto border'
																						style={{ background: props.item.rawValue.hex || '' }}
																					/>
																					<ComboboxItemLabel>
																						{props.item.rawValue.code} {props.item.rawValue.colorName}
																					</ComboboxItemLabel>
																				</div>
																				<ComboboxItemIndicator />
																			</ComboboxItem>
																		)}
																		options={colorRerences().arr}
																	>
																		<ComboboxControl aria-errormessage={field.error} aria-label='Referencias'>
																			<div
																				class='h-5 w-5 mr-2 m-auto border'
																				style={{ background: colorsRecord()[field.value || 0]?.hex || 'transparent' }}
																			/>
																			<ComboboxInput />
																			<ComboboxTrigger title='Ver referencias' aria-label='Referencias' />
																		</ComboboxControl>
																		<Show when={Boolean(field.error)}>
																			<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
																		</Show>
																		<ComboboxContent />
																	</Combobox>
																</TableCell>
															)}
														</Field>
														<For each={SIZES}>
															{size => (
																<Field name={`${fieldOrders.name}.${i()}.sizes.${size}`} type='number'>
																	{(field, props) => (
																		<TableCell>
																			<Input
																				min={0}
																				step={1}
																				type='number'
																				placeholder='12'
																				aria-errormessage={field.error}
																				value={field.value}
																				{...props}
																			/>
																		</TableCell>
																	)}
																</Field>
															)}
														</For>
														<TableCell class='flex justify-center'>
															<Button
																class='whitespace-nowrap px-2 bg-red-500 hover:bg-red-600'
																disabled={fieldOrders.items.length === 1}
																onClick={() => remove(form, fieldOrders.name, { at: i() })}
															>
																<FiTrash2 size={22} />
															</Button>
														</TableCell>
													</TableRow>
												</TableBody>
											)}
										</For>
									</Table>
								</TableContainer>
								<div class='flex justify-end'>
									<Button
										class='whitespace-nowrap gap-1 bg-blue-600 hover:bg-blue-700'
										onClick={() => {
											insert(form, fieldOrders.name, {
												value: {
													colorByRef: 0,
													sizes: DEFAULT_SIZES,
												},
											});
										}}
									>
										<FiPlus size={22} />
										Nuevo insumo/tela
									</Button>
								</div>
							</>
						)}
					</FieldArray>
				</div>
			</div>
			<div class='flex justify-between m-4'>
				<Button type='button' onclick={handleCancel} variant='destructive'>
					Cancelar
				</Button>
				<Button type='submit' disabled={form.submitting} variant='success'>
					Crear
				</Button>
			</div>
		</Form>
	);
}

export default CustomCreateForm;
