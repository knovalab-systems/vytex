import { createQuery } from '@tanstack/solid-query';
import { For, Match, Switch } from 'solid-js';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '~/components/ui/Table';
import { SIZES } from '~/constants/sizes';
import { useColors } from '~/hooks/useColors';
import { getFabricsQuery } from '~/modules/fabric/requests/fabricGet';
import { getResourcesQuery } from '~/modules/resource/requests/resourceGet';
import type { ColorByReference } from '~/types/core';

function ReferenceDetails(props: { colorsByReference: Omit<ColorByReference, 'id'>[], code: string }) {
    const { getColorsRecord } = useColors();

    // get all fabrics and resources id
    const fabricsIds = props.colorsByReference.flatMap(color => (color.fabrics ?? []).map(fabric => fabric?.fabric_id ?? ''));
    const resourcesIds = props.colorsByReference.flatMap(color => (color.resources ?? []).map(resource => resource?.resource_id ?? ''));

    const fabrics = createQuery(() => getFabricsQuery(1, { ids: fabricsIds.filter(id => id !== '') as number[] }));
    const resources = createQuery(() => getResourcesQuery(1, { ids: resourcesIds.flat().filter(id => id !== '') as number[] }));

    const getResourceDetails = (id: number) => {
        return resources.data?.find(resource => resource.id === id);
    };

    const getFabricDetails = (id: number) => {
        return fabrics.data?.find(fabric => fabric.id === id);
    };

    return (
        <Switch>
            <Match when={fabrics.isError || resources.isError}>
                <ErrorMessage title='Error al cargar telas o insumos' />
            </Match>
            <Match when={fabrics.isFetching || resources.isFetching}>
                <Loading label='Cargando telas e insumos' />
            </Match>
            <Match when={fabrics.isSuccess || resources.isSuccess}>
                <div class='p-2 gap-4 bg-white border-gray-100 shadow-md rounded-md border'>
                    <h1 class='text-2xl font-bold text-center mb-4'>Referencia #{props.code}</h1>
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
                                                {resource => {
                                                    const resourceDetails = getResourceDetails(resource?.resource_id ?? 0);
                                                    return (
                                                        <TableRow class='*:p-2 text-center'>
                                                            <TableCell>{resourceDetails ? `${resourceDetails.name} - ${resourceDetails.code}` : ''}</TableCell>
                                                            <TableCell>
                                                                <div
                                                                    class='h-8 w-8 border'
                                                                    style={{
                                                                        background: getColorsRecord()[resourceDetails?.color_id || 0]?.hex || 'transparent',
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <For each={SIZES}>
                                                                {size => (
                                                                    <TableCell>{resource?.[size] ?? '0'}</TableCell>
                                                                )}
                                                            </For>
                                                        </TableRow>
                                                    );
                                                }}
                                            </For>
                                            <For each={color.fabrics}>
                                                {fabric => {
                                                    const fabricDetails = getFabricDetails(fabric?.fabric_id ?? 0);
                                                    return (
                                                        <TableRow class='*:p-2 text-center'>
                                                            <TableCell>{fabricDetails ? `${fabricDetails.name} - ${fabricDetails.code}` : ''}</TableCell>
                                                            <TableCell>
                                                                <div
                                                                    class='h-8 w-8 border'
                                                                    style={{
                                                                        background: getColorsRecord()[fabricDetails?.color_id || 0]?.hex || 'transparent',
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <For each={SIZES}>
                                                                {size => (
                                                                    <TableCell>{fabric?.[size] ?? '0'}</TableCell>
                                                                )}
                                                            </For>
                                                        </TableRow>
                                                    );
                                                }}
                                            </For>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )}
                    </For>
                </div>
            </Match>
        </Switch>
    );
}

export default ReferenceDetails;