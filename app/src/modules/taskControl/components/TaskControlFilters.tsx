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
import { type Tasks, useSteps } from '~/hooks/useSteps';
import { type TaskControlStatus, useTaskControlStatus } from '~/hooks/useTaskControlStatus';
import type { TaskControlFilter } from '~/types/filter';

function TaskControlFilters(props: {
	filters: TaskControlFilter;
	setFilters: Setter<TaskControlFilter>;
	tasks: Tasks;
}) {
	const hasFilters = () => Object.keys(props.filters).length !== 0;
	const [open, setOpen] = createSignal(false);
	const [active, setActive] = createSignal(hasFilters());
	const [form, { Form, Field }] = createForm<TaskControlFilter>({ initialValues: props.filters });
	const { getTaskControlStatus, getTaskControlStatusRecord } = useTaskControlStatus();
	const { getTasksRecord } = useSteps();

	const handleSubmit: SubmitHandler<TaskControlFilter> = data => {
		const filters: TaskControlFilter = {};
		for (const [k, v] of Object.entries(data)) {
			if (v && ((Array.isArray(v) && v.length > 0) || (typeof v === 'number' && v > 0))) {
				filters[k as keyof TaskControlFilter] = v as (number & number[]) | undefined;
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
					<Field name={'id'} type='number'>
						{(field, props) => (
							<div>
								<Label for='id-filter'>Identificador</Label>
								<Input
									value={field.value ?? ''}
									{...props}
									class='h-full'
									type='number'
									placeholder='Identificador de la tarea'
									autocomplete='off'
									id='id-filter'
								/>
							</div>
						)}
					</Field>
					<Field name={'order'} type='number'>
						{(field, props) => (
							<div>
								<Label for='order-filter'>Orden</Label>
								<Input
									value={field.value ?? ''}
									{...props}
									class='h-full'
									type='number'
									placeholder='Orden de la tarea'
									autocomplete='off'
									id='order-filter'
								/>
							</div>
						)}
					</Field>
					<Field name={'status'} type='string'>
						{field => (
							<>
								<LabelSpan>Estado</LabelSpan>
								<Select<TaskControlStatus[0]>
									multiple
									class='whitespace-nowrap min-w-48'
									optionValue='id'
									optionTextValue='name'
									value={field.value?.map(e => getTaskControlStatusRecord()[e]) ?? []}
									onChange={value => {
										setValue(
											form,
											'status',
											value.map(e => e.id),
										);
									}}
									placeholder='Selecciona uno o más estados'
									itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue.name}</SelectItem>}
									options={getTaskControlStatus()}
								>
									<SelectTrigger title='Ver estados' class='min-w-48 w-full'>
										<SelectValue<TaskControlStatus[0]> class='bg-white'>
											{state => (
												<div class='flex w-full gap-1'>
													<For each={state.selectedOptions()}>
														{option => (
															<span class='my-auto flex' onPointerDown={e => e.stopPropagation()}>
																{option.name}
																<button type='button' onClick={() => state.remove(option)}>
																	<IoCloseOutline class='my-auto mr-2' title='Remover todos' />
																</button>
															</span>
														)}
													</For>
													<Show when={state.selectedOptions().length > 1}>
														<span>
															<button type='reset' onPointerDown={e => e.stopPropagation()} onClick={state.clear}>
																<IoCloseOutline class='text-destructive' size={20} title='Remover todos' />
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
					<Field name={'tasks'} type='string'>
						{field => (
							<div>
								<LabelSpan>Tareas</LabelSpan>
								<Combobox<Tasks[0]>
									value={field.value?.map(e => getTasksRecord()[e]) ?? []}
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
									placeholder='Selecciona o escribe una tarea'
									itemComponent={props => (
										<ComboboxItem item={props.item}>
											<ComboboxItemLabel>{props.item.rawValue.name}</ComboboxItemLabel>
											<ComboboxItemIndicator />
										</ComboboxItem>
									)}
									options={props.tasks}
								>
									<ComboboxControl<Tasks[0]> class='bg-white' aria-label='Tareas'>
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
														<IoCloseOutline class='text-destructive' title='Remover todos' />
													</button>
												</Show>
												<ComboboxTrigger title='Ver tareas' />
											</>
										)}
									</ComboboxControl>
									<ComboboxContent />
								</Combobox>
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

export default TaskControlFilters;
