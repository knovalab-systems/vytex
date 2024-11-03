import { For } from 'solid-js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { SIZES } from '~/constants/sizes';
import { useColors } from '~/hooks/useColors';
import type { ColorByReference } from '~/types/core';

function ReferenceDetails(props: { colorsByReference: Omit<ColorByReference, 'id'>[], refCode: string }) {
    const { getColorsRecord } = useColors();

    return (
        <div class='p-2 gap-4 bg-white border-gray-100 shadow-md rounded-md border'>
            <h1 class='text-2xl font-bold text-center mb-4'>Referencia #{props.refCode}</h1>
            <For each={props.colorsByReference}>
                {color => (
                    <div class='mb-4'>
                        <div class='flex items-center mb-2'>
                            <h2 class='mr-2'>{getColorsRecord()[color.color_id || 0]?.name || ''}</h2>
                            <div
                                class='h-8 w-8 border'
                                style={{
                                    background: getColorsRecord()[color.color_id || 0]?.hex || 'transparent',
                                }}
                            />
                        </div>
                        <TableContainer class='border'>
                            <Table>
                                <TableHeader>
                                    <TableRow class='*:text-center *:p-2'>
                                        <TableHead class='2xl:w-1/8'>Insumo/Tela</TableHead>
                                        <TableHead class='min-w-16'>Color</TableHead>
                                        <For each={SIZES}>{size => <TableHead class='min-w-16'>{size}</TableHead>}</For>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <For each={color.resources}>
                                        {resource =>
                                        (<TableRow class='*:p-2 text-center'>
                                            <TableCell>{resource?.resource?.name} - {resource?.resource?.code}</TableCell>
                                            <TableCell>
                                                <div
                                                    class='h-8 w-8 border'
                                                    style={{
                                                        background: getColorsRecord()[resource?.resource?.color_id || 0]?.hex || 'transparent',
                                                    }}
                                                />
                                            </TableCell>
                                            <For each={SIZES}>
                                                {size => (
                                                    <TableCell>{resource?.[size] ?? '0'}</TableCell>
                                                )}
                                            </For>
                                        </TableRow>
                                        )}
                                    </For>
                                    <For each={color.fabrics}>
                                        {fabric => (
                                            <TableRow class='*:p-2 text-center'>
                                                <TableCell>{fabric?.fabric?.name} - {fabric?.fabric?.code}</TableCell>
                                                <TableCell>
                                                    <div
                                                        class='h-8 w-8 border'
                                                        style={{
                                                            background: getColorsRecord()[fabric?.fabric?.color_id || 0]?.hex || 'transparent',
                                                        }}
                                                    />
                                                </TableCell>
                                                <For each={SIZES}>
                                                    {size => (
                                                        <TableCell>{fabric?.[size] ?? '0'}</TableCell>
                                                    )}
                                                </For>
                                            </TableRow>
                                        )}
                                    </For>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )}
            </For>
        </div>

    );
}

export default ReferenceDetails;