import { type SubmitHandler, createForm, getValues, insert, remove, setValue, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { FiCopy, FiPlus, FiTrash2 } from 'solid-icons/fi';
import { For, Show, createSignal } from 'solid-js';
import toast from 'solid-toast';
import ImagePreviewSelect from '~/components/ImagePreviewSelect';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { STATUS_CODE } from '~/constants/http';
import { REFS_PATH } from '~/constants/paths';
import { type colorsArray, useColors } from '~/hooks/useColors';
import useImageUploader from '~/hooks/useImageUploader';
import {
	type FabricsByRefCreate,
	type ResourcesByRefCreate,
	createReferenceRequest,
} from '~/modules/reference/requests/referenceCreate';
import { type ResourceFabric, SIZES, defaultSizeSchema } from '~/schemas/sizes';
import {
	type ReferenceCreateRequest,
	ReferenceCreateSchema,
	type ReferenceCreateType,
} from '../schemas/referenceCreateSchema';

type Combined = {
	id: string;
	name: string;
};
function ReferenceCreateForm(props: {
	colors: colorsArray;
	fabrics: FabricsByRefCreate;
	resources: ResourcesByRefCreate;
}) {
	const { colorRecord } = useColors();
	const navigate = useNavigate();
	const [frontImage, setFrontImage] = createSignal<File | undefined>(undefined);
	const [backImage, setBackImage] = createSignal<File | undefined>(undefined);
	const { uploadLocalImages, uploadedFiles, error } = useImageUploader();

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
					resources: [{ resource: '', sizes: defaultSizeSchema }],
				},
			],
		},
	});

	async function handleImageUpload() {
		const images = [frontImage(), backImage()].filter(Boolean);
		const filteredImages = images.filter((image): image is File => image !== undefined);
		await uploadLocalImages(filteredImages);

		if (error()) {
			toast.error('Error al subir imagenes');
			return;
		}
	}

	const handleSubmit: SubmitHandler<ReferenceCreateType> = async data => {
		await handleImageUpload();
		const checkFabricResources = data.colors.map(() => ({ fabric: false, resource: false }));
		const reference: ReferenceCreateRequest = {
			reference: data.reference.toString(),
			front: uploadedFiles()?.[0].id || '',
			back: uploadedFiles()?.[1].id || '',
			colors: data.colors.map((color, i) => ({
				color: color.color,
				...color.resources.reduce(
					(p: ResourceFabric, v) => {
						const r = Number(v.resource.slice(1));
						if (v.resource.startsWith('r')) {
							checkFabricResources[i].resource = true;
							p.resources.push({ ...v.sizes, resource: r });
						} else {
							checkFabricResources[i].fabric = true;
							p.fabrics.push({ ...v.sizes, fabric: r });
						}
						return p;
					},
					{ resources: [], fabrics: [] },
				),
			})),
		};

		if (checkFabricResources.some(e => e.resource === false)) {
			toast.error('Cada color de la referencia debe tener al menos un insumo ');
			return;
		}

		if (checkFabricResources.some(e => e.fabric === false)) {
			toast.error('Cada color de la referencia debe tener al menos una tela.');
			return;
		}

		return createReferenceRequest(reference)
			.then(() => {
				toast.success('Referencia creada correctamente');
				navigate(REFS_PATH);
			})
			.catch(error => {
				if (error.response.status === STATUS_CODE.conflict) {
					toast.error(`El código de la referencia "${data.reference}" no está disponible. Intente con otro.`);
				} else {
					toast.error('Error al crear referencia');
				}
			});
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
					<Field name='reference' type='number'>
						{(field, props) => (
							<div>
								<LabelSpan>Código de la referencia</LabelSpan>
								<Input
									type='number'
									placeholder='3453 '
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
					<Button type='button' onclick={handleCancel} class='bg-red-500 hover:bg-red-600'>
						Cancelar
					</Button>
					<Button type='submit' disabled={form.submitting} class='bg-green-600 hover:bg-green-700'>
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
													<Select
														class='whitespace-nowrap min-w-48'
														value={field.value}
														onChange={value => {
															setValue(form, `${fieldColors.name}.${iColor()}.color`, value);
														}}
														placeholder='Selecciona un color'
														itemComponent={props => (
															<SelectItem item={props.item}>
																<div class='flex gap-2'>
																	<div
																		class='h-5 w-5 m-auto border'
																		style={{ background: colorRecord()[props.item.rawValue]?.hex || '' }}
																	/>
																	{colorRecord()[props.item.rawValue]?.name}
																</div>
															</SelectItem>
														)}
														options={props.colors.map(color => color.id)}
													>
														<SelectTrigger title='Ver colores' aria-errormessage={field.error} aria-label='Colores'>
															<SelectValue<string>>
																{state => (
																	<div class='flex gap-2'>
																		<Show when={Boolean(colorRecord()[state.selectedOption()])}>
																			<div
																				class='h-5 w-5 m-auto border'
																				style={{ background: colorRecord()[state.selectedOption()]?.hex || '' }}
																			/>
																		</Show>
																		{colorRecord()[state.selectedOption()]?.name || 'Selecciona un color'}
																	</div>
																)}
															</SelectValue>
														</SelectTrigger>
														<Show when={Boolean(field.error)}>
															<div class={'text-sm my-auto text-red-600'}>{field.error}</div>
														</Show>
														<SelectContent />
													</Select>

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
																							value={resourceObject()[field.value || '']}
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
																							<ComboboxControl aria-errormessage={field.error} aria-label='Colores'>
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
															class='whitespace-nowrap gap-1 bg-blue-600 hover:bg-blue-700'
															onClick={() => {
																insert(form, fieldResources.name, {
																	value: {
																		resource: '',
																		sizes: defaultSizeSchema,
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
								class='whitespace-nowrap gap-1 bg-blue-600 hover:bg-blue-700'
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
								class='whitespace-nowrap gap-1 bg-blue-600 hover:bg-blue-700'
								onClick={() => {
									insert(form, fieldColors.name, {
										value: {
											color: 0,
											resources: [{ resource: '', sizes: defaultSizeSchema }],
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
				<Button type='button' onclick={handleCancel} class='bg-red-500 hover:bg-red-600'>
					Cancelar
				</Button>
				<Button type='submit' disabled={form.submitting} class='bg-green-600 hover:bg-green-700'>
					Crear
				</Button>
			</div>
			<div class='flex flex-row gap-2'>
				<div class='text-center p-4 bg-white rounded-md border border-gray-100 shadow-md xl:col-span-2'>
					<p>Foto frontal</p>
					<ImagePreviewSelect
						id='front'
						onFileSelected={setFrontImage}
						width='26rem'
						height='26rem'
						aria-label='Foto frontal'
					/>
				</div>
				<div class='text-center p-4 bg-white rounded-md border border-gray-100 shadow-md xl:col-span-2'>
					<p>Foto posterior</p>
					<ImagePreviewSelect
						id='back'
						onFileSelected={setBackImage}
						width='26rem'
						height='26rem'
						aria-label='Foto posterior'
					/>
				</div>
			</div>
		</Form>
	);
}

export default ReferenceCreateForm;
