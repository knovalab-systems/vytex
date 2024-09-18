import { type SubmitHandler, createForm, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { For, Show, createMemo } from 'solid-js';
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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { CUSTOMS_PATH } from '~/constants/paths';
import { DEFAULT_SIZES, SIZES } from '~/constants/sizes';
import { useColors } from '~/hooks/useColors';
import type { GetCustomType } from '~/modules/custom/requests/CustomGet';
import type { Order } from '~/types/core';
import { type RefByOrderCreate, createOrderRequest } from '../request/orderCreate';
import { OrderCreateSchema, type OrderCreateType } from '../schemas/orderCreate';

type ColorReference = {
	colorName: string;
	id: number;
	code: string;
	hex: string;
};

function OrderCreateForm(props: { references: RefByOrderCreate; custom?: GetCustomType }) {
	const { colorsRecord } = useColors();

	const colorReferences = createMemo(() => {
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

	const [form, { Form, Field }] = createForm<OrderCreateType>({
		validate: valiForm(OrderCreateSchema),
		initialValues: {
			colorByRef: 0,
			sizes: DEFAULT_SIZES,
		},
	});

	const handleSubmit: SubmitHandler<OrderCreateType> = data => {
		const sizes = data.sizes;
		if (Object.values(sizes).every(size => size === 0)) {
			return toast.error('Cada referencia debe tener al menos una talla con un valor mayor a 0.');
		}

		const order: Order = {
			...sizes,
			color_by_reference_id: data.colorByRef,
			custom_id: props.custom?.id,
		};

		return createOrderRequest(order)
			.then(() => {
				toast.success('Orden creada exitosamente.');
				navigate(CUSTOMS_PATH);
			})
			.catch(() => toast.error('Error al crear la orden.'));
	};

	return (
		<Form class='w-full lg:w-5/6 2xl:w-4/5' onSubmit={handleSubmit}>
			<div class='space-y-4 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
				<h1 class='text-2xl font-bold text-center'>Crear orden</h1>
				<div class='w-full space-y-4'>
					<TableContainer class='border lg:max-h-[40vh] overflow-auto '>
						<Table>
							<TableHeader>
								<TableRow class='*:text-center *:p-2'>
									<TableHead class=' 2xl:w-1/8'>Referencia</TableHead>
									<For each={SIZES}>{size => <TableHead class='min-w-16'>{size}</TableHead>}</For>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow class='*:p-2'>
									<Field name='colorByRef' type='number'>
										{field => (
											<TableCell>
												<Combobox<ColorReference>
													class='whitespace-nowrap min-w-48'
													value={colorReferences().obj[field.value || 0] || null}
													onChange={value => {
														setValue(form, 'colorByRef', value ? value.id : 0);
													}}
													onInputChange={value => {
														if (value === '') {
															setValue(form, 'colorByRef', 0);
														}
													}}
													multiple={false}
													optionLabel='code'
													optionValue='id'
													placeholder='Selecciona o escribe una referencia'
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
													options={colorReferences().arr}
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
											<Field name={`sizes.${size}`} type='number'>
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
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			</div>
			<div class='flex justify-between m-4'>
				<CancelButton to={CUSTOMS_PATH} />
				<Button type='submit' disabled={form.submitting} variant='success'>
					Crear
				</Button>
			</div>
		</Form>
	);
}

export default OrderCreateForm;
