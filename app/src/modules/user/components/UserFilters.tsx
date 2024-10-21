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
import { type Roles, useRoles } from '~/hooks/useRoles';
import type { UserFilter } from '~/types/filter';
import type { StateValues } from '~/types/state';

function UserFilters(props: { filters: UserFilter; setFilters: Setter<UserFilter> }) {
	const { getRoles, getRolesRecord } = useRoles();
	const hasFilters = () => Object.keys(props.filters).length !== 0;
	const [open, setOpen] = createSignal(false);
	const [active, setActive] = createSignal(hasFilters());
	const [form, { Form, Field }] = createForm<UserFilter>({ initialValues: props.filters });

	const handleSubmit: SubmitHandler<UserFilter> = data => {
		const filters: UserFilter = {};
		for (const [k, v] of Object.entries(data)) {
			if (v && v.length > 0) {
				filters[k as keyof UserFilter] = v as string & string[] & StateValues;
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
								<Label for='name-field'>Nombre</Label>
								<Input
									autocomplete='off'
									placeholder='Nombre del usuario'
									id='name-field'
									value={field.value ?? ''}
									{...props}
								/>
							</div>
						)}
					</Field>
					<Field name={'username'}>
						{(field, props) => (
							<div>
								<Label for='username-field'>Nombre de usuario</Label>
								<Input
									autocomplete='off'
									placeholder='Nombre de usuario del usuario'
									id='username-field'
									value={field.value ?? ''}
									{...props}
								/>
							</div>
						)}
					</Field>
					<Field name={'roles'} type='string'>
						{field => (
							<div>
								<LabelSpan>Roles</LabelSpan>
								<Combobox<Roles[0]>
									value={field.value?.map(e => getRolesRecord()[e]) ?? []}
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
									placeholder='Selecciona o escribe un rol'
									itemComponent={props => (
										<ComboboxItem item={props.item}>
											<ComboboxItemLabel>{props.item.rawValue.name}</ComboboxItemLabel>
											<ComboboxItemIndicator />
										</ComboboxItem>
									)}
									options={getRoles()}
								>
									<ComboboxControl<Roles[0]> class='bg-white' aria-label='Roles'>
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
												<ComboboxTrigger title='Ver roles' />
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

export default UserFilters;
