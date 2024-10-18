import {
	type SubmitHandler,
	createForm,
	getValues,
	insert,
	remove,
	reset,
	setValue,
	valiForm,
	validate,
} from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import type { VytexSize } from '@vytex/client';
import { FiCopy, FiPlus, FiTrash2 } from 'solid-icons/fi';
import { For, Match, Show, Switch, createSignal } from 'solid-js';
import toast from 'solid-toast';
import CancelButton from '~/components/CancelButton';
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
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import { STATUS_CODE } from '~/constants/http';
import { REFS_PATH } from '~/constants/paths';
import { DEFAULT_SIZES, SIZES } from '~/constants/sizes';
import { type Colors, useColors } from '~/hooks/useColors';
import {
	type FabricsByRefCreate,
	type ResourcesByRefCreate,
	createReferenceRequest,
} from '~/modules/reference/requests/referenceCreate';
import { uploadImagesRequest } from '~/requests/imageUpload';
import type { Reference, ResourceFabric } from '~/types/core';
import { ReferenceCreateSchema, type ReferenceCreateType } from '../schemas/referenceCreate';

type Combined = {
	id: string;
	name: string;
};

function ReferenceCreateForm(props: { fabrics: FabricsByRefCreate; resources: ResourcesByRefCreate }) {
	const { getColorsRecord, getColors } = useColors();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = createSignal('operational');
	const [newOperational, setNewOperational] = createSignal('');


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
					resources: [{ resource: '', sizes: DEFAULT_SIZES }],
				},
			],
			pieces: Array(6).fill({ piece: undefined }),
			front: undefined,
			back: undefined,
		},
	});

	const handleNext = async () => {
		const currentTab = activeTab();
		const validationFields: Record<string, (keyof ReferenceCreateType)[]> = {
			form: ['code', 'colors'],
			piece: ['front', 'back', 'piece'],
			operational: ['operational'],
		};

		const nextTab: Record<string, string> = {
			form: 'piece',
			piece: 'operational',
		};

		const isValid = await validate(form, validationFields[currentTab]);

		if (!isValid) {
			toast.error('Complete todos los campos requeridos.');
			return;
		}

		if (currentTab === 'form') {
			const formValues = getValues(form);
			if (!formValues.colors) {
				toast.error('Debe seleccionar al menos un color.');
				return;
			}

			const checkFabricResources = formValues.colors.map(() => ({ fabric: false, resource: false }));
			formValues.colors.forEach((color, i) => {
				if (!color || !color.resources) {
					toast.error('Cada color debe tener al menos un recurso.');
					return;
				}

				for (const v of color.resources) {
					if (v?.resource?.startsWith('r')) {
						checkFabricResources[i].resource = true;
					} else {
						checkFabricResources[i].fabric = true;
					}
				}
			});

			if (checkFabricResources.some(e => e.resource === false)) {
				toast.error('Cada color de la referencia debe tener al menos un insumo.');
				return;
			}

			if (checkFabricResources.some(e => e.fabric === false)) {
				toast.error('Cada color de la referencia debe tener al menos una tela.');
				return;
			}
		}

		setActiveTab(nextTab[currentTab]);
	};

	const handlePrev = () => {
		const currentTab = activeTab();
		const prevTab: Record<string, string> = {
			operational: 'piece',
			piece: 'form',
		};

		if (prevTab[currentTab]) {
			setActiveTab(prevTab[currentTab]);
		}
	};

	const handleSubmit: SubmitHandler<ReferenceCreateType> = async data => {
		const reference: Reference = {
			code: data.code.toString(),
			colors: data.colors.map((color, i) => ({
				color_id: color.color,
				...color.resources.reduce(
					(p: ResourceFabric, v) => {
						const r = Number(v.resource.slice(1));
						if (v.resource.startsWith('r')) {
							p.resources.push({ ...(v.sizes as VytexSize), resource_id: r });
						} else {
							p.fabrics.push({ ...(v.sizes as VytexSize), fabric_id: r });
						}
						return p;
					},
					{ resources: [], fabrics: [] },
				),
			})),
		};

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

	return (
		<Form
			class='h-full w-full justify-between flex flex-col'
			onSubmit={handleSubmit}
		>
			<Tabs value={activeTab()}>
				<TabsList class='sticky top-0 z-10'>
					<TabsTrigger value="form">Formulario</TabsTrigger>
					<TabsTrigger value="piece">Piezas</TabsTrigger>
					<TabsTrigger value="operational">Listado Operacional</TabsTrigger>
					<TabsIndicator />
				</TabsList>
				<div class="mt-1">
					<TabsContent value="form">
						<div class='w-full space-y-2 xl:space-y-0 xl:grid xl:grid-cols-4 h-full gap-2 bg-gray-100'>
							<div class='mb-auto flex flex-col justify-center gap-4 p-4 bg-white rounded-md border border-gray-100 shadow-md'>
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
																		value={getColorsRecord()[field.value || 0] || null}
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
															resources: [{ resource: '', sizes: DEFAULT_SIZES }],
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
						</div>
					</TabsContent>
					<TabsContent value='piece'>
						<div class='flex flex-row gap-2'>
							<div class='text-center p-4 bg-white rounded-md border border-gray-100 shadow-md flex-none w-[28rem] h-[30rem]'>
								<Field name='front' type='File'>
									{(field, props) => (
										<div class='w-full h-full'>
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
							<div class='text-center p-4 bg-white rounded-md border border-gray-100 shadow-md flex-none w-[28rem] h-[30rem]'>
								<Field name='back' type='File'>
									{(field, props) => (
										<div class='w-full h-full'>
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
							<div class='text-center p-4 bg-white rounded-md border border-gray-100 shadow-md flex-grow'>
								<LabelSpan>Piezas</LabelSpan>
								<FieldArray name='pieces'>
									{fieldPieces => (
										<div>
											<div class='grid grid-cols-3 gap-2'>
												<For each={fieldPieces.items}>
													{(_, piece) => (
														<div class='relative mt-2 w-[18rem] h-[18rem] border border-gray-200'>
															<Field name={`${fieldPieces.name}.${piece()}.piece`} type='File'>
																{(field, props) => (
																	<>
																		<FileInput
																			label='Foto'
																			preview
																			class='w-full h-full'
																			value={field.value}
																			error={field.error}
																			required
																			{...props}
																		/>
																		<Show when={field.value}>
																			<Button
																				variant='destructive'
																				class='absolute top-0 right-0'
																				onClick={() => remove(form, fieldPieces.name, { at: piece() })}
																			>
																				<FiTrash2 size={10} />
																			</Button>
																		</Show>
																	</>
																)}
															</Field>
														</div>
													)}
												</For>
											</div>
											<div class='flex justify-end mt-2'>
												<Button
													variant='action'
													class='whitespace-nowrap gap-1'
													onClick={() => {
														insert(form, fieldPieces.name, { value: { piece: undefined } });
													}}
												>
													<FiPlus size={32} />
													Agregar foto
												</Button>
											</div>
										</div>
									)}
								</FieldArray>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="operational">
						<div class='flex flex-col gap-2 max-w-5xl mx-auto'>
							<TableContainer>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>#</TableHead>
											<TableHead>Descripción</TableHead>
											<TableHead>Acciones</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<FieldArray name='operational'>
											{fieldOperational => (
												<>
													<For each={fieldOperational.items}>
														{(_, index) => (
															<TableRow>
																<TableCell>{index() + 1}</TableCell>
																<TableCell>
																	<Field name={`${fieldOperational.name}.${index()}.description`}>
																		{(field, props) => (
																			<Input
																				value={field.value}
																				aria-errormessage={field.error}

																				{...props}
																			/>
																		)}
																	</Field>
																</TableCell>
																<TableCell>
																	<Button
																		variant='destructive'
																		onClick={() => remove(form, fieldOperational.name, { at: index() })}
																	>
																		<FiTrash2 size={16} />
																	</Button>
																</TableCell>
															</TableRow>
														)}
													</For>
													<TableRow>
														<TableCell>{fieldOperational.items.length + 1}</TableCell>
														<TableCell>
															<Input
																type='text'
																placeholder='Agregar descripción'
																value={newOperational()}
																onInput={(e) => setNewOperational(e.currentTarget.value)}
															/>
														</TableCell>
														<TableCell>
															<Button
																variant='action'
																onClick={() => {
																	const newOperationalValue = newOperational();
																	if (newOperationalValue.trim() !== '') {
																		insert(form, 'operational', { value: { description: newOperational() } });
																		setNewOperational('');
																	}
																}}
															>
																<FiPlus size={16} />
																Agregar
															</Button>
														</TableCell>
													</TableRow>
												</>
											)}
										</FieldArray>
									</TableBody>
								</Table>
							</TableContainer>
						</div>
					</TabsContent>
				</div>
			</Tabs>
			<div class="flex justify-between">
				<Show when={activeTab() === 'form'}>
					<div class='xl:flex hidden justify-between'>
						<CancelButton to={REFS_PATH} />
					</div>
				</Show>
				<Show when={activeTab() !== 'form'}>
					<Button variant='secondary' onClick={handlePrev}>Atrás</Button>
				</Show>
				<Switch>
					<Match when={activeTab() !== 'operational'}>
						<Button variant='secondary' onClick={handleNext}>Siguiente</Button>
					</Match>
					<Match when={activeTab() === 'operational'}>
						<Button type='submit' variant='success'>
							Crear
						</Button>
					</Match>
				</Switch>
			</div>
		</Form>
	);
}

export default ReferenceCreateForm;
