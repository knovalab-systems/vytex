import { FaSolidPlus } from 'solid-icons/fa';
import { TbFilterX } from 'solid-icons/tb';
import { createSignal, onCleanup } from 'solid-js';
import toast from 'solid-toast';
import FilterInput from '~/components/FilterInput';
import SelectOptions from '~/components/SelectOptions';
import { Button } from '~/components/ui/Button';
import { USER_STATUS_OPTIONS } from '~/utils/constants';

type UserControlsProps = {
	setNameFilter: (value: string) => void;
	nameFilterValue: string;
	setUsernameFilter: (value: string) => void;
	usernameFilterValue: string;
	setStatusFilter: (value: string) => void;
	statusFilterValue: string;
};

const UserControls = (props: UserControlsProps) => {
	const [clearOption, setClearOption] = createSignal(false);

	let timeoutId: NodeJS.Timeout;

	const debounce = (func: (value: string) => void, delay: number) => {
		return (value: string) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func(value), delay);
		};
	};

	onCleanup(() => {
		clearTimeout(timeoutId);
	});

	const clearFilter = () => {
		props.setNameFilter('');
		props.setUsernameFilter('');
		props.setStatusFilter('');
		setClearOption(true);
	};

	const areFiltersApplied = () => {
		return [props.nameFilterValue, props.usernameFilterValue, props.statusFilterValue].some(value => value !== '');
	};

	return (
		<div class='flex flex-wrap justify-between'>
			<div class='flex flex-wrap gap-4'>
				<Button
					class='w-auto font-bold bg-practice_date h-12 hover:bg-blue-800'
					onclick={() => {
						toast.success('Nuevo usuario');
					}}
				>
					Nuevo
					<FaSolidPlus class='ml-2' size={20} />
				</Button>
				<FilterInput
					class='w-32'
					filterValue={props.usernameFilterValue}
					setFilter={debounce(props.setUsernameFilter, 300)}
					placeholder='Usuario'
				/>
				<FilterInput
					filterValue={props.nameFilterValue}
					setFilter={debounce(props.setNameFilter, 300)}
					placeholder='Nombre'
				/>
				<SelectOptions
					placeholder='Estado de usuario'
					options={USER_STATUS_OPTIONS}
					clearOptios={clearOption()}
					setClearOption={setClearOption}
					setSelect={props.setStatusFilter}
				/>
			</div>
			<div>
				<Button
					class='w-auto font-bold bg-red-500 h-12 hover:bg-red-600'
					onclick={clearFilter}
					disabled={!areFiltersApplied()}
				>
					<TbFilterX class='mr-2' size={20} />
					Limpiar filtros
				</Button>
			</div>
		</div>
	);
};

export default UserControls;
