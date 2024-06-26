import { A } from '@solidjs/router';
import { AiFillEdit, AiOutlinePlus } from 'solid-icons/ai';
import { Button } from '~/components/ui/Button';
import { TableCell } from '~/components/ui/Table';
import { USERS_PATH, USER_UPDATE_PATH } from '~/utils/paths';

function ActionsCell(props: { userId: string }) {
	return (
		<TableCell>
			<A href={`${USER_UPDATE_PATH}/${props.userId}`} title='Actualizar usuario'>
				<Button variant='ghost' class=' inline-flex gap-2 hover:bg-baby_blue p-2'>
					<AiFillEdit size={20} />
					Actualizar
				</Button>
			</A>
			<A href={`${USERS_PATH}/${props.userId}`} title='Detalles del usuario'>
				<Button variant='ghost' class=' inline-flex gap-2 hover:bg-baby_blue p-2'>
					<AiOutlinePlus size={20} />
					Detalles
				</Button>
			</A>
		</TableCell>
	);
}

export default ActionsCell;
