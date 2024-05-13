import { FaSolidPlus } from 'solid-icons/fa';
import { onCleanup } from 'solid-js';
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

	return (
		<div class='flex flex-wrap gap-4'>
			<Button
				class='w-auto font-bold bg-practice_date h-12 hover:bg-blue-800'
				onclick={() => {
					toast.success('Nuevo usuario');
				}}
			>
				Nuevo usuario
				<FaSolidPlus class='ml-2' size={20} />
			</Button>
			<FilterInput
				filterValue={props.usernameFilterValue}
				setFilter={debounce(props.setUsernameFilter, 400)}
				placeholder='Usuario'
			/>
			<FilterInput
				filterValue={props.nameFilterValue}
				setFilter={debounce(props.setNameFilter, 400)}
				placeholder='Nombre'
			/>
			<SelectOptions placeholder='Estado de usuario' options={USER_STATUS_OPTIONS} setSelect={props.setStatusFilter} />
		</div>
	);
};

export default UserControls;
