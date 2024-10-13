import { type SubmitHandler, createForm, reset, setValue } from '@modular-forms/solid';
import { IoCloseOutline } from 'solid-icons/io';
import { TbFilterX } from 'solid-icons/tb';
import { For, type Setter, Show, createSignal } from 'solid-js';
import FilterButton from '~/components/FilterButton';
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
import { STATUS_VALUES } from '~/constants/status';
import { type Colors, useColors } from '~/hooks/useColors';
import { type Suppliers, useSuppliers } from '~/hooks/useSuppliers';
import type { FabricFilter, ResourceFilter } from '~/types/filter';
import type { StateValues } from '~/types/state';

function FabricFilters(props: { filters: FabricFilter; setFilters: Setter<FabricFilter> }) {
	const hasFilters = () => Object.keys(props.filters).length !== 0;
	const { getColors, getColorsRecord } = useColors();
	const { getSuppliers, getSuppliersRecord } = useSuppliers();
	const [open, setOpen] = createSignal(false);
	const [active, setActive] = createSignal(hasFilters());
	const [form, { Form, Field }] = createForm<ResourceFilter>({ initialValues: props.filters });

	const handleSubmit: SubmitHandler<ResourceFilter> = data => {
		const filters: ResourceFilter = {};
		for (const [k, v] of Object.entries(data)) {
			if (v && v.length > 0) {
				filters[k as keyof ResourceFilter] = v as (string & number[] & StateValues) | undefined;
				setActive(true);
			}
		}

		props.setFilters(filters);
		setOpen(false);
		reset(form, { initialValues: filters });
		if (Object.keys(filters).length === 0) {
			setActive(false);
		}
	};

	const clearFilter = () => {
		reset(form, { initialValues: {} });
		props.setFilters({});
		setOpen(false);
		setActive(false);
	};

	return (
		<FilterButton open={open()} onOpenChange={setOpen} active={active()}>
			<Form onSubmit={handleSubmit}>
				<div class='flex flex-col gap-2'>
					<Field name={'name'}>
						{(field, props) => (
							<div>
								<Label for='name-filter'>Nombre</Label>
								<Input
									value={field.value ?? ''}
									{...props}
									class='h-full'
									type='text'
									placeholder='Nombre de la tela'
									autocomplete='off'
									id='name-filter'
								/>
							</div>
						)}
					</Field>
					<Field name={'code'}>
						{(field, props) => (
							<div>
								<Label for='code-filter'>Código</Label>
								<Input
									value={field.value ?? ''}
									{...props}
									class='h-full'
									type='number'
									placeholder='Código de la tela'
									autocomplete='off'
									id='code-filter'
								/>
							</div>
						)}
					</Field>
					<Field name={'colors'} type='string'>
						{field => (
							<div>
								<LabelSpan>Colores</LabelSpan>
								<Combobox<Colors[0]>
									value={field.value?.map(e => getColorsRecord()[e]) ?? []}
									onChange={value => {
										setValue(
											form,
											field.name,
											value.map(e => e.id),
										);
									}}
									class='whitespace-nowrap'
									optionLabel='name'
									multiple
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
									options={getColors()}
								>
									<ComboboxControl<Colors[0]> class='bg-white w-full' aria-label='Colores'>
										{state => (
											<>
												<div class='inline-flex gap-1 w-full'>
													<For each={state.selectedOptions()}>
														{option => (
															<span class='my-auto flex' onPointerDown={e => e.stopPropagation()}>
																<div class='h-5 w-5 mr-2 m-auto border' style={{ background: option.hex || '' }} />
																{option.name}
																<button type='button' onClick={() => state.remove(option)}>
																	<IoCloseOutline class='my-auto mr-2' title='Remover' />
																</button>
															</span>
														)}
													</For>
													<ComboboxInput />
												</div>
												<Show when={state.selectedOptions().length > 1}>
													<button type='button' onPointerDown={e => e.stopPropagation()} onClick={state.clear}>
														<IoCloseOutline title='Remover todos' />
													</button>
												</Show>

												<ComboboxTrigger title='Ver colores' aria-label='Colores' />
											</>
										)}
									</ComboboxControl>
									<ComboboxContent />
								</Combobox>
							</div>
						)}
					</Field>
					<Field name={'suppliers'} type='string'>
						{field => (
							<div>
								<LabelSpan>Proveedores</LabelSpan>
								<Combobox<Suppliers[0]>
									value={field.value?.map(e => getSuppliersRecord()[e]) ?? []}
									onChange={value => {
										setValue(
											form,
											field.name,
											value.map(e => e.id),
										);
									}}
									class='whitespace-nowrap'
									multiple={true}
									optionLabel='name'
									optionValue='id'
									placeholder='Selecciona o escribe un proveedor'
									itemComponent={props => (
										<ComboboxItem item={props.item}>
											<ComboboxItemLabel>{props.item.rawValue.name}</ComboboxItemLabel>
											<ComboboxItemIndicator />
										</ComboboxItem>
									)}
									options={getSuppliers()}
								>
									<ComboboxControl<Suppliers[0]> class='bg-white' aria-label='Proveedores'>
										{state => (
											<>
												<div class='inline-flex gap-1 w-full'>
													<For each={state.selectedOptions()}>
														{option => (
															<span class='my-auto flex' onPointerDown={e => e.stopPropagation()}>
																{option.name}
																<button type='button' onClick={() => state.remove(option)}>
																	<IoCloseOutline class='my-auto mr-2' title='Remover' />
																</button>
															</span>
														)}
													</For>
													<ComboboxInput />
												</div>
												<Show when={state.selectedOptions().length > 1}>
													<button type='button' onPointerDown={e => e.stopPropagation()} onClick={state.clear}>
														<IoCloseOutline title='Remover todos' />
													</button>
												</Show>
												<ComboboxTrigger title='Ver proveedores' />
											</>
										)}
									</ComboboxControl>
									<ComboboxContent />
								</Combobox>
							</div>
						)}
					</Field>
					<Field name={'state'}>
						{field => (
							<div>
								<LabelSpan>Estado</LabelSpan>
								<Select<string>
									value={field.value}
									onChange={value => {
										setValue(form, 'state', value as StateValues);
									}}
									class='h-full'
									options={STATUS_VALUES}
									placeholder='Selecciona un estado'
									itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
								>
									<SelectTrigger class='bg-white h-full min-w-48' aria-label='Estado' title='Ver estados'>
										<SelectValue<string>>{state => state.selectedOption()}</SelectValue>
									</SelectTrigger>
									<SelectContent />
								</Select>
							</div>
						)}
					</Field>
					<div class='flex justify-between'>
						<Button variant='destructive' onClick={clearFilter} disabled={!form.dirty && !hasFilters()}>
							<TbFilterX class='mr-2' size={20} />
							Limpiar filtros
						</Button>
						<Button variant='action' type='submit' disabled={!form.dirty}>
							Aplicar
						</Button>
					</div>
				</div>
			</Form>
		</FilterButton>
	);
}

export default FabricFilters;
