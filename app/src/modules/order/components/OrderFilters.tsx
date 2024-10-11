import { type SubmitHandler, createForm, reset, setValue } from '@modular-forms/solid';
import { IoCloseOutline } from 'solid-icons/io';
import { TbFilterX } from 'solid-icons/tb';
import { For, type Setter, Show, createSignal } from 'solid-js';
import FilterButton from '~/components/FilterButton';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label, LabelSpan } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { type OrderStatus, useOrderStatus } from '~/hooks/useOrderStatus';
import type { OrderFilter } from '~/types/filter';

function OrderFilters(props: { filters: OrderFilter; setFilters: Setter<OrderFilter> }) {
	const hasFilters = () => Object.keys(props.filters).length !== 0;
	const [open, setOpen] = createSignal(false);
	const [active, setActive] = createSignal(hasFilters());
	const [form, { Form, Field }] = createForm<OrderFilter>({ initialValues: props.filters });
	const { getOrderStatus, getOrderStatusRecord } = useOrderStatus();

	const handleSubmit: SubmitHandler<OrderFilter> = data => {
		const filters: OrderFilter = {};
		for (const [k, v] of Object.entries(data)) {
			if (v && v.length > 0) {
				filters[k as keyof OrderFilter] = v as (number[] & string) | undefined;
				setActive(true);
			}
		}

		props.setFilters(filters);
		setOpen(false);
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
					<Field name={'status'} type='string'>
						{field => (
							<>
								<LabelSpan>Estado</LabelSpan>
								<Select<OrderStatus[0]>
									multiple
									class='whitespace-nowrap min-w-48'
									optionValue='id'
									optionTextValue='name'
									value={field.value?.map(e => getOrderStatusRecord()[e]) ?? []}
									onChange={value => {
										setValue(
											form,
											'status',
											value.map(e => e.id),
										);
									}}
									placeholder='Selecciona uno o más estados'
									itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue.name}</SelectItem>}
									options={getOrderStatus()}
								>
									<SelectTrigger title='Ver estados' class='min-w-48 w-full'>
										<SelectValue<OrderStatus[0]> class='bg-white'>
											{state => (
												<div class='flex w-full gap-1'>
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
													<Show when={state.selectedOptions().length > 1}>
														<span>
															<button type='reset' onPointerDown={e => e.stopPropagation()} onClick={state.clear}>
																<IoCloseOutline class=' text-destructive' size={20} title='Remover todos' />
															</button>
														</span>
													</Show>
												</div>
											)}
										</SelectValue>
									</SelectTrigger>
									<SelectContent />
								</Select>
							</>
						)}
					</Field>
					<Field name={'createdDate'}>
						{(field, props) => (
							<Label for='createdDate-field'>
								Fecha de creación
								<Input
									type='date'
									placeholder='Fecha de creación'
									autocomplete='off'
									id='createdDate-field'
									aria-errormessage={field.error}
									required
									value={field.value}
									{...props}
								/>
							</Label>
						)}
					</Field>
					<Field name={'startedDate'}>
						{(field, props) => (
							<Label for='startedDate-field'>
								Fecha de inicio
								<Input
									type='date'
									placeholder='Fecha de inicio'
									autocomplete='off'
									id='startedDate-field'
									aria-errormessage={field.error}
									required
									value={field.value}
									{...props}
								/>
							</Label>
						)}
					</Field>
					<Field name={'finishedDate'}>
						{(field, props) => (
							<Label for='finishedDate-field'>
								Fecha de finalización
								<Input
									type='date'
									placeholder='Fecha de finalización'
									autocomplete='off'
									id='finishedDate-field'
									aria-errormessage={field.error}
									required
									value={field.value}
									{...props}
								/>
							</Label>
						)}
					</Field>
					<Field name={'canceledDate'}>
						{(field, props) => (
							<Label for='canceledDate-field'>
								Fecha de cancelación
								<Input
									type='date'
									placeholder='Fecha de cancelación'
									autocomplete='off'
									id='canceledDate-field'
									aria-errormessage={field.error}
									required
									value={field.value}
									{...props}
								/>
							</Label>
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

export default OrderFilters;
