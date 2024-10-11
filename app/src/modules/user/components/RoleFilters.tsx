import { type SubmitHandler, createForm, reset, setValue } from '@modular-forms/solid';
import { TbFilterX } from 'solid-icons/tb';
import { type Setter, createSignal } from 'solid-js';
import FilterButton from '~/components/FilterButton';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label, LabelSpan } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import type { RoleFilter, RoleFilterOrigin } from '~/types/filter';

function RoleFilters(props: { filters: RoleFilter; setFilters: Setter<RoleFilter> }) {
	const hasFilters = () => Object.keys(props.filters).length !== 0;
	const [open, setOpen] = createSignal(false);
	const [active, setActive] = createSignal(hasFilters());
	const [form, { Form, Field }] = createForm<RoleFilter>({ initialValues: props.filters });

	const handleSubmit: SubmitHandler<RoleFilter> = data => {
		const filters: RoleFilter = {};
		for (const [k, v] of Object.entries(data)) {
			if (v && v.length > 0) {
				filters[k as keyof RoleFilter] = v as RoleFilterOrigin | undefined;
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
								<Label for='name-field'>Nombre del rol</Label>
								<Input
									autocomplete='off'
									placeholder='Nombre del rol'
									id='name-field'
									value={field.value ?? ''}
									{...props}
								/>
							</div>
						)}
					</Field>
					<Field name={'origin'}>
						{field => (
							<div>
								<LabelSpan>Origen</LabelSpan>
								<Select<RoleFilterOrigin>
									value={field.value}
									onChange={value => {
										setValue(form, 'origin', value);
									}}
									class='h-full'
									options={['Personalizado', 'Sistema']}
									placeholder='Selecciona un origen'
									itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
								>
									<SelectTrigger class='bg-white h-full min-w-48' title='Ver origenes'>
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

export default RoleFilters;
