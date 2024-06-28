import { For, Show } from 'solid-js'
import StatusLabel from '~/components/StatusLabel'
import { Table, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table'
import type { GetFabricsType } from '../request/fabricsGetRequests'

function FabricTable(props: { fabrics?: GetFabricsType }) {
    return (
        <TableContainer>
            <Table class='table-fixed'>
                <TableHeader class='sticky top-0 z-10'>
                    <TableRow class=' bg-indigo-500 *:text-white hover:bg-indigo-500'>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Costo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <Show when={(props.fabrics?.length ?? 0) === 0}>
                    <TableRow class='bg-white'>
                        <TableCell colspan={6}>No se han encontraron telas.</TableCell>
                    </TableRow>
                </Show>
                <For each={props.fabrics} >
                    {fabric => (
                        <TableRow class='bg-white group'>
                            <TableCell>{fabric.id}</TableCell>
                            <TableCell>{fabric.name}</TableCell>
                            <TableCell class='py-0'>
                                <div class='flex gap-4'>
                                    <div class='my-auto'>{fabric.color.hex}</div>
                                    <div class='h-10 w-10 border-1' style={{ background: fabric.color.hex || '' }} />
                                </div>
                            </TableCell>
                            <TableCell>${fabric.cost} COP</TableCell>
                            <TableCell>
                                <StatusLabel status={!fabric.delete_at} />
                            </TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>

                    )}
                </For>
            </Table>
        </TableContainer>

    )
}

export default FabricTable