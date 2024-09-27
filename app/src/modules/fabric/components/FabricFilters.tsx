import { IoCloseOutline } from 'solid-icons/io';
import { TbFilterX } from 'solid-icons/tb';
import { type Accessor, For, type Setter, Show } from 'solid-js';
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
import { Label } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { STATUS_OPTIONS } from '~/constants/status';
import { type Colors, useColors } from '~/hooks/useColors';
import { type Suppliers, useSuppliers } from '~/hooks/useSuppliers';
import type { FabricFilter } from '~/types/filter';
import { debounce } from '~/utils/debounce';

function FabricFilters(props: { filters: Accessor<FabricFilter>; setFilters: Setter<FabricFilter> }) {
	const { getColors, getColorsRecord } = useColors();
	const { getSuppliers } = useSuppliers();

	const areActiveFilters = () => Object.values(props.filters()).some(e => e && e.length > 0);
	const clearFilter = () => props.setFilters({});

	return (
		<>
			<Label for='name-filter'>
				<Input
					value={props.filters().name ?? ''}
					onInput={debounce(e => props.setFilters(p => ({ ...p, name: e.target.value })), 400)}
					class='h-full'
					type='text'
					placeholder='Nombre de la tela'
					autocomplete='off'
					id='name-filter'
					required
				/>
			</Label>
			<Label for='code-filter'>
				<Input
					value={props.filters().code}
					onInput={debounce(e => props.setFilters(p => ({ ...p, code: e.target.value })), 400)}
					class='h-full'
					type='number'
					placeholder='Código de la tela'
					autocomplete='off'
					id='code-filter'
					required
				/>
			</Label>
			<Combobox<Colors[0]>
				value={props.filters().colors?.map(e => getColorsRecord()[e]) ?? []}
				onChange={value => {
					props.setFilters(p => ({ ...p, colors: value.map(e => e.id) }));
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
				<ComboboxControl<Colors[0]> class='bg-white' aria-label='Colores'>
					{state => (
						<>
							<div class='inline-flex gap-1'>
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
			<Combobox<Suppliers[0]>
				value={props.filters().suppliers?.map(e => getColorsRecord()[e]) ?? []}
				onChange={value => {
					props.setFilters(p => ({ ...p, suppliers: value.map(e => e.id) }));
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
							<div class='inline-flex gap-1'>
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
			<Select<string>
				value={props.filters().state ?? ''}
				onChange={value => {
					props.setFilters(p => ({ ...p, state: value }));
				}}
				class='h-full'
				options={Object.keys(STATUS_OPTIONS)}
				placeholder='Selecciona un estado'
				itemComponent={props => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
			>
				<SelectTrigger class='bg-white h-full min-w-48' aria-label='Estado' title='Ver estados'>
					<SelectValue<string>>{state => state.selectedOption()}</SelectValue>
				</SelectTrigger>
				<SelectContent />
			</Select>
			<Show when={areActiveFilters()}>
				<Button
					class='w-auto font-bold ml-auto bg-red-500 hover:bg-red-600'
					onClick={clearFilter}
					disabled={!areActiveFilters()}
				>
					<TbFilterX class='mr-2' size={20} />
					Limpiar filtros
				</Button>
			</Show>
		</>
	);
}

export default FabricFilters;
