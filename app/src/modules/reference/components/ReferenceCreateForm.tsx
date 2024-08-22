import {
	type SubmitHandler,
	createForm,
	getValues,
	insert,
	remove,
	reset,
	setValue,
	valiForm,
} from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import type { VytexSize } from '@vytex/client';
import { FiCopy, FiPlus, FiTrash2 } from 'solid-icons/fi';
import { For, Show } from 'solid-js';
import toast from 'solid-toast';
import FileInput from '~/components/FileInput';
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
import { LabelSpan } from '~/components/ui/Label';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { STATUS_CODE } from '~/constants/http';
import { REFS_PATH } from '~/constants/paths';
import { type Colors, useColors } from '~/hooks/useColors';
import {
	type FabricsByRefCreate,
	type ResourcesByRefCreate,
	createReferenceRequest,
} from '~/modules/reference/requests/referenceCreate';
import { uploadImagesRequest } from '~/requests/imageUpload';
import type { Reference } from '~/schemas/core';
import { type ResourceFabric, SIZES, defaultSizeValues } from '~/schemas/sizes';
import { ReferenceCreateSchema, type ReferenceCreateType } from '../schemas/referenceCreate';

type Combined = {
	id: string;
	name: string;
};
function ReferenceCreateForm(props: {
	colors: Colors;
	fabrics: FabricsByRefCreate;
	resources: ResourcesByRefCreate;
}) {
	const { colorsRecord } = useColors();
	const navigate = useNavigate();

	const resources: () => Combined[] = () => [
		...props.resources.map(i => ({ id: `r${i.id}`, name: i.name as string })),
		...props.fabrics.map(i => ({ id: `f${i.id}`, name: i.name as string })),
	];

	const resourceObject = () =>
		resources().reduce(
			(prev: Record<string, Combined>, v) => {
				prev[v.id] = v;
				return prev;
			},
			{ '': { name: 'Nada', id: '' } },
		);

	const [form, { Form, Field, FieldArray }] = createForm<ReferenceCreateType>({
		validate: valiForm(ReferenceCreateSchema),
		initialValues: {
			colors: [
				{
					resources: [{ resource: '', sizes: defaultSizeValues }],
				},
			],
		},
	});

	const handleSubmit: SubmitHandler<ReferenceCreateType> = async data => {
		const checkFabricResources = data.colors.map(() => ({ fabric: false, resource: false }));
		const reference: Reference = {
			code: data.code.toString(),
			colors: data.colors.map((color, i) => ({
				color_id: color.color,
				...color.resources.reduce(
					(p: ResourceFabric, v) => {
						const r = Number(v.resource.slice(1));
						if (v.resource.startsWith('r')) {
							checkFabricResources[i].resource = true;
							p.resources.push({ ...(v.sizes as VytexSize), resource_id: r });
						} else {
							checkFabricResources[i].fabric = true;
							p.fabrics.push({ ...(v.sizes as VytexSize), fabric_id: r });
						}
						return p;
					},
					{ resources: [], fabrics: [] },
				),
			})),
		};

		if (checkFabricResources.some(e => e.resource === false)) {
			return toast.error('Cada color de la referencia debe tener al menos un insumo ');
		}

		if (checkFabricResources.some(e => e.fabric === false)) {
			return toast.error('Cada color de la referencia debe tener al menos una tela.');
		}

		const formData = new FormData();
		formData.append('files', data.front);
		formData.append('files', data.back);

		return uploadImagesRequest(formData)
			.then(async res => {
				return createReferenceRequest({
					...reference,
					front: (res as unknown as Array<Record<'id', string>>)[0].id,
					back: (res as unknown as Array<Record<'id', string>>)[1].id,
				})
					.then(() => {
						toast.success('Referencia creada correctamente');
						navigate(REFS_PATH);
					})
					.catch(error => {
						if (error.response.status === STATUS_CODE.conflict) {
							toast.error(`El código de la referencia "${data.code}" no está disponible. Intente con otro.`);
						} else {
							toast.error('Error al crear referencia.');
						}
					});
			})
			.catch(() => toast.error('Error al subir imagenes'));
	};

	const handleCancel = () => navigate(REFS_PATH);

	return (
		<Form
			class='w-full space-y-2 xl:space-y-0 xl:grid xl:grid-cols-4 h-full gap-2 bg-gray-100'
			onSubmit={handleSubmit}
			enctype='multipart/form-data'
		>
			<div class='flex flex-col gap-4 mb-auto'>
				<div class='flex flex-col justify-center gap-4 p-4 bg-white rounded-md border border-gray-100 shadow-md'>
					<h1 class='text-2xl font-bold text-center'>Crear referencia</h1>
					<Field name='code' type='number'>
						{(field, props) => (
							<div>
								<LabelSpan>Código de la referencia</LabelSpan>
								<Input
									type='number'
									placeholder='3453'
									autocomplete='on'
									aria-errormessage={field.error}
									required
									value={field.value}
									{...props}
								/>
							</div>
						)}
					</Field>
				</div>

				<div class='xl:flex hidden justify-between'>
					<Button type='button' onclick={handleCancel} variant='destructive'>
						Cancelar
					</Button>
					<Button type='submit' disabled={form.submitting} variant='success'>
						Crear
					</Button>
				</div>
			</div>
			<FieldArray name='colors'>
				{fieldColors => (
					<div class='col-span-3 gap-2 space-y-2'>
						<For each={fieldColors.items}>
							{(_, iColor) => (
								<div class='overflow-x-auto mb-auto justify-center gap-4 p-4 bg-white rounded-md border border-gray-100 shadow-md'>
									<div class='flex flex-col gap-2 w-fit'>
										<Field name={`${fieldColors.name}.${iColor()}.color`} type='number'>
											{field => (
												<div class='flex gap-4 w-full'>
													<LabelSpan class='my-auto whitespace-nowrap'>Color de la referencia</LabelSpan>

													<Combobox<Colors[0]>
														class='whitespace-nowrap min-w-48'
														value={colorsRecord()[field.value || 0] || null}
														onChange={value => {
															setValue(form, `${fieldColors.name}.${iColor()}.color`, value ? value.id : 0);
														}}
														onInputChange={value => {
															if (value === '') {
																setValue(form, `${fieldColors.name}.${iColor()}.color`, 0);
															}
														}}
														multiple={false}
														optionLabel='name'
														optionValue='id'
														placeholder='Selecciona o escribe un color'
														itemComponent={props => (
															<ComboboxItem item={props.item}>
																<div class='flex gap-2'>
																	<div
																		class='h-5 w-5 m-auto border'
																		style={{ background: props.item.rawValue.hex || '' }}
																	/>
																	<ComboboxItemLabel>{props.item.rawValue.name}</ComboboxItemLabel>
																</div>
																<ComboboxItemIndicator />
															</ComboboxItem>
														)}
														options={props.colors.filter(e => !e.deleted_at)}
													>
														<ComboboxControl aria-errormessage={field.error} aria-label='Colores'>
															<div
																class='h-5 w-5 mr-2 m-auto border'
																style={{ background: colorsRecord()[field.value || 0]?.hex || 'transparent' }}
															/>
															<ComboboxInput />
															<ComboboxTrigger title='Ver colores' aria-label='Colores' />
														</ComboboxControl>
														<Show when={Boolean(field.error)}>
															<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
														</Show>
														<ComboboxContent />
													</Combobox>
													<Button
														class='ml-auto whitespace-nowrap gap-1 bg-red-500 hover:bg-red-600'
														disabled={fieldColors.items.length === 1}
														onClick={() => remove(form, fieldColors.name, { at: iColor() })}
													>
														<FiTrash2 size={22} />
														<span class='xl:block'>Remover color</span>
													</Button>
												</div>
											)}
										</Field>

										<FieldArray name={`colors.${iColor()}.resources`}>
											{fieldResources => (
												<>
													<TableContainer class='border'>
														<Table>
															<TableHeader>
																<TableRow class='*:text-center *:p-2'>
																	<TableHead class=' 2xl:w-1/8'>Insumo/Tela</TableHead>
																	<For each={SIZES}>{size => <TableHead class='min-w-16'>{size}</TableHead>}</For>
																	<TableHead class='p-0'>Remover</TableHead>
																</TableRow>
															</TableHeader>
															<For each={fieldResources.items}>
																{(_, iResource) => (
																	<TableBody>
																		<TableRow class='*:p-2'>
																			<Field name={`${fieldResources.name}.${iResource()}.resource`}>
																				{field => (
																					<TableCell>
																						<Combobox<Combined>
																							class='whitespace-nowrap min-w-48'
																							value={resourceObject()[field.value || ''] || null}
																							onChange={value => {
																								setValue(
																									form,
																									`${fieldResources.name}.${iResource()}.resource`,
																									value ? value.id : '',
																								);
																							}}
																							onInputChange={value => {
																								if (value === '') {
																									setValue(form, `${fieldResources.name}.${iResource()}.resource`, '');
																								}
																							}}
																							multiple={false}
																							optionLabel='name'
																							optionValue='id'
																							placeholder='Selecciona un insumo/tela'
																							itemComponent={props => (
																								<ComboboxItem item={props.item}>
																									<ComboboxItemLabel>{props.item.rawValue.name}</ComboboxItemLabel>
																									<ComboboxItemIndicator />
																								</ComboboxItem>
																							)}
																							options={resources()}
																						>
																							<ComboboxControl aria-errormessage={field.error} aria-label='Resources'>
																								<ComboboxInput />
																								<ComboboxTrigger title='Ver insumos y telas' />
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
																					<Field
																						name={`${fieldResources.name}.${iResource()}.sizes.${size}`}
																						type='number'
																					>
																						{(field, props) => (
																							<TableCell>
																								<Input
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
																					disabled={fieldResources.items.length === 1}
																					onClick={() => remove(form, fieldResources.name, { at: iResource() })}
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
															variant='action'
															class='whitespace-nowrap gap-1'
															onClick={() => {
																insert(form, fieldResources.name, {
																	value: {
																		resource: '',
																		sizes: defaultSizeValues,
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
							)}
						</For>
						<div class='flex justify-end my-2 gap-2'>
							<Button
								variant='action'
								class='whitespace-nowrap gap-1'
								onClick={() => {
									const values = getValues(form, fieldColors.name);
									const value = values[fieldColors.items.length - 1];
									insert(form, fieldColors.name, {
										// @ts-ignore values can be undefined
										value: value,
									});
								}}
							>
								<FiCopy size={22} />
								Duplicar color
							</Button>
							<Button
								variant='action'
								class='whitespace-nowrap gap-1'
								onClick={() => {
									insert(form, fieldColors.name, {
										value: {
											color: 0,
											resources: [{ resource: '', sizes: defaultSizeValues }],
										},
									});
								}}
							>
								<FiPlus size={22} />
								Nuevo color
							</Button>
						</div>
					</div>
				)}
			</FieldArray>
			<div class='flex xl:hidden my-2 justify-between'>
				<Button type='button' onclick={handleCancel} variant='destructive'>
					Cancelar
				</Button>
				<Button type='submit' disabled={form.submitting} variant='success'>
					Crear
				</Button>
			</div>
			<div class='flex flex-row gap-2'>
				<div class='text-center p-4 bg-white rounded-md border border-gray-100 shadow-md '>
					<Field name='front' type='File'>
						{(field, props) => (
							<div class='w-[26rem] h-[26rem]'>
								<LabelSpan>Foto frontal</LabelSpan>
								<FileInput
									label='Foto frontal'
									preview
									class='w-full h-full'
									value={field.value}
									error={field.error}
									required
									{...props}
								/>
								<Show when={field.value}>
									<div class='mt-2 flex justify-center w-full'>
										<Button variant='destructive' onClick={() => reset(form, field.name)}>
											<FiTrash2 size={22} />
											<span class='xl:block'>Eliminar foto</span>
										</Button>
									</div>
								</Show>
							</div>
						)}
					</Field>
				</div>
				<div class='text-center p-4 bg-white rounded-md border border-gray-100 shadow-md '>
					<Field name='back' type='File'>
						{(field, props) => (
							<div class='w-[26rem] h-[26rem]'>
								<LabelSpan>Foto posterior</LabelSpan>
								<FileInput
									label='Foto posterior'
									preview
									class='w-full h-full'
									value={field.value}
									error={field.error}
									required
									{...props}
								/>
								<Show when={field.value}>
									<div class='mt-2 flex justify-center w-full'>
										<Button variant='destructive' onClick={() => reset(form, field.name)}>
											<FiTrash2 size={22} />
											<span class='xl:block'>Eliminar foto</span>
										</Button>
									</div>
								</Show>
							</div>
						)}
					</Field>
				</div>
			</div>
		</Form>
	);
}

export default ReferenceCreateForm;
