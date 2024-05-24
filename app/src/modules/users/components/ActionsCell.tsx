import { A } from '@solidjs/router';
import { AiFillEdit } from 'solid-icons/ai';
import { Button } from '~/components/ui/Button';
import { TableCell } from '~/components/ui/Table';
import { USER_UPDATE_PATH } from '~/utils/paths';

function ActionsCell(props: { userId: string }) {
	return (
		<TableCell>
			<A href={`${USER_UPDATE_PATH}/${props.userId}`}>
				<Button variant='ghost' class='flex gap-2 hover:bg-baby_blue p-2'>
					<AiFillEdit size={18} />
					Actualizar
				</Button>
			</A>
		</TableCell>
	);
}

export default ActionsCell;
