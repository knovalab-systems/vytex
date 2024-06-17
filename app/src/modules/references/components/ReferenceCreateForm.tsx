import { type SubmitHandler, createForm, getValues, insert, remove, valiForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { For } from 'solid-js';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { LabelSpan } from '~/components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
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
		<Form class='w-full grid grid-cols-4 h-full bg-gray-100' onSubmit={handleSubmit}>
			<div class='flex flex-col justify-center gap-4 p-4 m-2 bg-white rounded-md border border-gray-100 shadow-md'>
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
			<FieldArray name='colors'>
				{fieldColors => (
					<div class='col-span-3 row-span-2'>
						<For each={fieldColors.items}>
							{(_, iColor) => (
								<div class='mb-auto justify-center gap-4 p-4 m-2 bg-white rounded-md border border-gray-100 shadow-md'>
									<div class='flex flex-col gap-4'>
										<Field name={`${fieldColors.name}.${iColor()}.color`} type='number'>
											{(field, props) => (
												<div class='flex gap-4'>
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
														class='whitespace-nowrap bg-red-500 hover:bg-red-600'
														disabled={fieldColors.items.length === 1}
														onClick={() => remove(form, fieldColors.name, { at: iColor() })}
													>
														Remover color
													</Button>
												</div>
											)}
										</Field>
										<Table>
											<TableHeader>
												<TableRow class='*:text-center *:p-2'>
													<TableHead class=' w-1/8'>Insumo</TableHead>
													<For each={SIZES}>{size => <TableHead>{size}</TableHead>}</For>
												</TableRow>
											</TableHeader>
											<FieldArray name={`colors.${iColor()}.resources`}>
												{fieldResources => (
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
																			<Field name={`${fieldResources.name}.${iResource()}.sizes.${size}`} type='number'>
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
																</TableRow>
															</TableBody>
														)}
													</For>
												)}
											</FieldArray>
										</Table>
									</div>
								</div>
							)}
						</For>
						<div class='flex justify-end m-2 '>
							<Button
								class='whitespace-nowrap bg-blue-600 hover:bg-blue-700'
								onClick={() => {
									const values = getValues(form, fieldColors.name);
									const value = values[fieldColors.items.length - 1];
									insert(form, fieldColors.name, {
										// @ts-ignore maybe value is conflict
										value: value,
									});
								}}
							>
								Añadir color
							</Button>
						</div>
					</div>
				)}
			</FieldArray>
			<div class='flex m-2 justify-between'>
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
