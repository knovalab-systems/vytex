import { FaSolidPlus } from 'solid-icons/fa';
import { TbFilterX } from 'solid-icons/tb';
import { onCleanup } from 'solid-js';
import toast from 'solid-toast';
import FilterInput from '~/components/FilterInput';
import SelectOptions from '~/components/SelectOptions';
import { Button } from '~/components/ui/Button';
import { USER_ROLES_OPTIONS, USER_STATUS_OPTIONS } from '~/utils/constants';

type UserControlsProps = {
	setNameFilter: (value: string) => void;
	nameFilterValue: string;
	setUsernameFilter: (value: string) => void;
	usernameFilterValue: string;
	setStatusFilter: (value: string) => void;
	statusFilterValue: string;
	setRoleIdFilter: (value: string) => void;
	roleIdFilterValue: string;
};

const UserControls = (props: UserControlsProps) => {

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
		props.setRoleIdFilter('');
	};

	const areFiltersApplied = () => {
		return [props.nameFilterValue, props.usernameFilterValue, props.statusFilterValue, props.roleIdFilterValue].some(value => value !== '');
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
					class='w-52'
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
					options={USER_STATUS_OPTIONS}
					placeholder='Estado de usuario'
					setSelect={props.setStatusFilter}
					value={props.statusFilterValue}
				/>
				<SelectOptions
					options={USER_ROLES_OPTIONS}
					placeholder='Rol de usuario'
					setSelect={props.setRoleIdFilter}
					value={props.roleIdFilterValue}
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
