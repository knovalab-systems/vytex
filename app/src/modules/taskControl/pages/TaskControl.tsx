import { useLocation, useNavigate, useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { For, Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/Button';
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import { TASKS_PATH } from '~/constants/paths';
import ReferenceDetails from '~/modules/reference/components/ReferenceDetails';
import ReferenceImages from '~/modules/reference/components/ReferenceImages';
import { type GetReferenceImageType, getReferenceImageQuery } from '~/modules/reference/requests/referenceGet';
import type { ColorByReference } from '~/types/core';
import { getReferenceQuery } from '../request/taskControlGet';


function TaskControl() {
    return (
        <AllowPolicies policies={['ReadReferences']}>
            <TaskControlPage />
        </AllowPolicies>
    );
}

function TaskControlPage() {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const reference = createQuery(() => getReferenceQuery(Number(params.id)));
    const piece = createQuery(() => getReferenceImageQuery(Number(params.id)));


    const currentPath = location.pathname;
    const process = currentPath.split('/')[2];

    const handleCancel = () => {
        if (!process) return;
        navigate(`${TASKS_PATH}/${process}`);
    };

    return (
        <div class='flex items-center justify-center h-full'>
            <Switch>
                <Match when={reference.isError || piece.isError}>
                    <ErrorMessage title='Error al cargar referencia' />
                </Match>
                <Match when={reference.isFetching || piece.isFetching}>
                    <Loading label='Cargando referencia' />
                </Match>
                <Match when={reference.isError || piece.isError}>Error</Match>
                <Match when={reference.isSuccess && piece.isSuccess}>
                    <div class='h-full w-full justify-between flex flex-col gap-2'>
                        <Tabs>
                            <TabsList class='sticky top-0 z-10 '>
                                <TabsTrigger value='operations'>Listado Operacional</TabsTrigger>
                                <TabsTrigger value='pieces'>Piezas</TabsTrigger>
                                <TabsTrigger value='details'>Detalles</TabsTrigger>
                                <TabsIndicator />
                            </TabsList>
                            <TabsContent value='operations' class='flex flex-col gap-2'>
                                <div class='flex flex-col justify-center gap-4 p-4 bg-white rounded-md border border-gray-100 shadow-md'>
                                    <h1 class='text-xl font-bold mb-4'>Listado operacional</h1>
                                    <For each={reference.data?.operations} fallback={<div>No operations available</div>}>
                                        {(operation, index) => (
                                            <div class='flex items-center gap-2 p-2 bg-gray-50 rounded-md shadow-sm'>
                                                <span class='text-gray-500 font-semibold'>{index() + 1}.</span>
                                                <h2 class='text-gray-800'>{operation.description}</h2>
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </TabsContent>
                            <TabsContent value='pieces' class='flex flex-col gap-2'>
                                <ReferenceImages pieces={piece.data as GetReferenceImageType} />
                            </TabsContent>
                            <TabsContent value='details' class='flex flex-col gap-2'>
                                <ReferenceDetails
                                    colorsByReference={reference.data?.colors as ColorByReference[]}
                                    refCode={reference.data?.code ?? ''}
                                />
                            </TabsContent>
                        </Tabs>
                        <div class='flex m-4 justify-between'>
                            <Button type='button' onclick={handleCancel} variant='secondary'>
                                Volver
                            </Button>
                        </div>
                    </div>
                </Match>
            </Switch>
        </div>
    );
}

export default TaskControl;
