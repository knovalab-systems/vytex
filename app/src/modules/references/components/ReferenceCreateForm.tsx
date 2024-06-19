import { type SubmitHandler, createForm, getValues, insert, remove, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { FiPlus, FiCopy, FiTrash2 } from 'solid-icons/fi';
import { For } from 'solid-js';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { LabelSpan } from '~/components/ui/Label';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { SIZES, defaultSizeSchema } from '~/schemas/sizesSchema';
import { REFS_PATH } from '~/utils/paths';
import { ReferenceCreateSchema, type ReferenceCreateType } from '../schemas/referenceCreateSchema';

function ReferenceCreateForm() {
	const navigate = useNavigate();

	const [form, { Form, Field, FieldArray }] = createForm<ReferenceCreateType>({
		validate: valiForm(ReferenceCreateSchema),
		initialValues: {
			colors: [
				{
					color: 0,
					resources: [{ resource: '', sizes: defaultSizeSchema }],
				},
			],
		},
	});

	const handleSubmit: SubmitHandler<ReferenceCreateType> = async data => {
		console.log(data);
	};

	const handleCancel = () => navigate(REFS_PATH);

	return (
		<Form class='w-full space-y-2 xl:space-y-0 xl:grid xl:grid-cols-4 h-full gap-2 bg-gray-100' onSubmit={handleSubmit}>
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
						Guardar
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
											{(field, props) => (
												<div class='flex gap-4 w-full'>
													<LabelSpan class='my-auto whitespace-nowrap'>Color de la referencia</LabelSpan>
													<Input
														type='number'
														placeholder='3453 '
														autocomplete='on'
														aria-errormessage={field.error}
														required
														value={field.value}
														{...props}
													/>
													<Button
														class='whitespace-nowrap gap-1 bg-red-500 hover:bg-red-600'
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
																	<TableHead class=' 2xl:w-1/8'>Insumo</TableHead>
																	<For each={SIZES}>{size => <TableHead class='min-w-16'>{size}</TableHead>}</For>
																	<TableHead class='p-0'>Remover</TableHead>
																</TableRow>
															</TableHeader>
															<For each={fieldResources.items}>
																{(_, iResource) => (
																	<TableBody>
																		<TableRow class='*:p-2'>
																			<Field name={`${fieldResources.name}.${iResource()}.resource`}>
																				{(field, props) => (
																					<TableCell>
																						<Input
																							placeholder='3453'
																							aria-errormessage={field.error}
																							value={field.value}
																							{...props}
																						/>
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
															Nuevo insumo
														</Button>
													</div>
												</>
											)}
										</FieldArray>
									</div>
								</div>
							)}
						</For>
						<div class='flex justify-end m-2 gap-2'>
							<Button
								class='whitespace-nowrap gap-1 bg-blue-600 hover:bg-blue-700'
								onClick={() => {
									const values = getValues(form, fieldColors.name);
									const value = values[fieldColors.items.length - 1];
									insert(form, fieldColors.name, {
										// @ts-ignore maybe value is conflict
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
					Guardar
				</Button>
			</div>
		</Form>
	);
}

export default ReferenceCreateForm;
