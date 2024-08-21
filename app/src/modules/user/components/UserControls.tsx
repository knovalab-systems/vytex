import { useNavigate } from '@solidjs/router';
import { AiOutlinePlus } from 'solid-icons/ai';
import { TbFilterX } from 'solid-icons/tb';
import { Show, onCleanup } from 'solid-js';
import SelectOptions from '~/components/SelectOptions';
import { Button } from '~/components/ui/Button';
import { USER_CREATE_PATH } from '~/constants/paths';
import { roleList } from '~/constants/roles';
import { USER_STATUS_OPTIONS } from '~/constants/status';
import FilterInput from '~/modules/user/components/FilterInput';
import { cleanupDebounce, debounce } from '~/utils/debounce';

type UserControlsProps = {
	setNameFilter: (value: string) => void;
	nameFilterValue: string;
	setUsernameFilter: (value: string) => void;
	usernameFilterValue: string;
	setStatusFilter: (value: string) => void;
	statusFilterValue: string;
	setRoleIdFilter: (value: string) => void;
	setPage: () => void;
	roleIdFilterValue: string;
};

const UserControls = (props: UserControlsProps) => {
	const navigate = useNavigate();

	onCleanup(() => {
		cleanupDebounce();
	});

	const clearFilter = () => {
		props.setNameFilter('');
		props.setUsernameFilter('');
		props.setStatusFilter('');
		props.setRoleIdFilter('');
	};

	const areFiltersApplied = () => {
		return [props.nameFilterValue, props.usernameFilterValue, props.statusFilterValue, props.roleIdFilterValue].some(
			value => value !== '',
		);
	};

	const goToUserCreationPage = () => {
		navigate(USER_CREATE_PATH);
	};

	const setUsername = (value: string) => {
		props.setUsernameFilter(value);
		props.setPage();
	};

	const setName = (value: string) => {
		props.setNameFilter(value);
		props.setPage();
	};

	const setRole = (value: string) => {
		props.setRoleIdFilter(value);
		props.setPage();
	};

	const setStatus = (value: string) => {
		props.setStatusFilter(value);
		props.setPage();
	};

	return (
		<div class='flex flex-wrap gap-2 md:gap-4 p-1'>
			<Button variant='new' class='h-full' onclick={goToUserCreationPage}>
				Nuevo usuario
				<AiOutlinePlus class='ml-2' size={22} />
			</Button>
			<FilterInput
				class='w-52'
				filterValue={props.usernameFilterValue}
				setFilter={debounce(setUsername, 300)}
				placeholder='Usuario'
			/>
			<FilterInput filterValue={props.nameFilterValue} setFilter={debounce(setName, 300)} placeholder='Nombre' />
			<SelectOptions
				options={USER_STATUS_OPTIONS}
				placeholder='Estado de usuario'
				setSelect={setStatus}
				value={props.statusFilterValue}
			/>
			<SelectOptions
				options={roleList.map(role => ({ label: role.label, value: role.key }))}
				placeholder='Rol de usuario'
				setSelect={setRole}
				value={props.roleIdFilterValue}
			/>
			<Show when={areFiltersApplied()}>
				<Button
					class='w-auto font-bold ml-auto bg-red-500 h-12 hover:bg-red-600'
					onclick={clearFilter}
					disabled={!areFiltersApplied()}
				>
					<TbFilterX class='mr-2' size={20} />
					Limpiar filtros
				</Button>
			</Show>
		</div>
	);
};

export default UserControls;
