import { For, Show } from 'solid-js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { parseDateTimeHuman } from '~/lib/parseTime';
import type { GetOrdersType } from '../request/OrderGet';

function OrderTable(props: { orders?: GetOrdersType }) {
    return (
        <TableContainer>
            <Table class='md:table-fixed'>
                <TableHeader class='sticky top-0 z-10'>
                    <TableRow class=' bg-indigo-500 *:text-white hover:bg-indigo-500'>
                        <TableHead>ID</TableHead>
                        <TableHead>ID pedido</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha de creación</TableHead>
                        <TableHead>Fecha de cancelación</TableHead>
                        <TableHead>Fecha de finalización</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <Show when={(props.orders?.length ?? 0) === 0}>
                        <TableRow class='bg-white'>
                            <TableCell colspan={7}>No se han encontrado ordenes.</TableCell>
                        </TableRow>
                    </Show>
                    <For each={props.orders}>
                        {order => (
                            <TableRow class='bg-white group'>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.custom_id}</TableCell>
                                <TableCell>{order.status === 'Created' ? 'creado' : ''}</TableCell>
                                <TableCell>{parseDateTimeHuman(order.created_at)}</TableCell>
                                <TableCell>{parseDateTimeHuman(order.canceled_at)}</TableCell>
                                <TableCell>{parseDateTimeHuman(order.finished_at)}</TableCell>
                                <TableCell>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        )}
                    </For>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default OrderTable;