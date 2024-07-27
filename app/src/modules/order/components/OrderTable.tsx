import { For, Show } from 'solid-js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { parseDateTimeHuman } from '~/lib/parseTime';
import type { GetOrdersType } from '../request/OrderGet';

function OrderTable(props: { orders?: GetOrdersType }) {
    return (
        <Show when={props.orders}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeader>ID</TableHeader>
                            <TableHead>ID pedido</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha de creación</TableHead>
                            <TableHead>Fecha de cancelación</TableHead>
                            <TableHead>Fecha de finalización</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <Show when={(props.orders?.length ?? 0) === 0}>
                            <TableRow class='bg-white'>
                                <TableCell colspan={7}>No se han encontraron ordenes.</TableCell>
                            </TableRow>
                        </Show>
                        <For each={props.orders}>
                            {order => (
                                <TableRow class='bg-white group'>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.custom_id}</TableCell>
                                    <TableCell>{order.status}</TableCell>
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
        </Show>
    );
}

export default OrderTable;