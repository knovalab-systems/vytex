import { A } from '@solidjs/router';
import { AiFillEdit } from 'solid-icons/ai';
import { Button } from '~/components/ui/Button';
import { TableCell } from '~/components/ui/Table';
import { SUPPLIERS_UPDATE_PATH } from '~/constants/paths';

function ActionsCell(props: { supplierId: number }) {
    return (
        <TableCell>
            <A href={`${SUPPLIERS_UPDATE_PATH}/${props.supplierId}`} title='Actualizar proveedor'>
                <Button variant='ghost' class=' inline-flex gap-2 hover:bg-baby_blue p-2'>
                    <AiFillEdit size={20} />
                    Actualizar
                </Button>
            </A>
        </TableCell>
    );
}

export default ActionsCell;