import { useNavigate, useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { For, Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/Button';
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import { REFS_PATH } from '~/constants/paths';
import type { ColorByReference, TimeByTask } from '~/types/core';
import ReferenceCard from '../components/ReferenceCard';
import ReferenceDetails from '../components/ReferenceDetails';
import { getReferenceForSupervisorQuery } from '../requests/referenceGet';

function Reference() {
	return (
		<AllowPolicies policies={['ReadReferences']}>
			<ReferenceProSupervisor />
		</AllowPolicies>
	);
}

function ReferenceProSupervisor() {
	const params = useParams();

	const reference = createQuery(() => getReferenceForSupervisorQuery(Number(params.id)));

	const navigate = useNavigate();
	const handleCancel = () => navigate(REFS_PATH);

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={reference.isError}>
					<ErrorMessage title='Error al cargar tiempos' />
				</Match>
				<Match when={reference.isFetching}>
					<Loading label='Cargando tiempos' />
				</Match>
				<Match when={reference.isError}>Error</Match>
				<Match when={reference.isSuccess}>
					<div class='h-full w-full justify-between flex flex-col gap-2'>
						<Tabs>
							<TabsList class='sticky top-0 z-10 '>
								<TabsTrigger value='details'>Detalles</TabsTrigger>
								<TabsTrigger value='pieces'>Piezas</TabsTrigger>
								<TabsTrigger value='operations'>Listado Operacional</TabsTrigger>
								<TabsTrigger value='times'>Tiempos</TabsTrigger>
								<TabsIndicator />
							</TabsList>
							<TabsContent value='details' class='flex flex-col gap-2'>
								<ReferenceDetails
									colorsByReference={reference.data?.colors as ColorByReference[]}
									refCode={reference.data?.code ?? ''}
								/>
								<div class='flex m-4 justify-between'>
									<Button type='button' onclick={handleCancel} variant='secondary'>
										Volver
									</Button>
								</div>
							</TabsContent>
							<TabsContent value='pieces' class='flex flex-col gap-2'>
								<div class='flex flex-col justify-center gap-4 p-4 bg-white rounded-md border border-gray-100 shadow-md'>
									<h1>Piezas</h1>
								</div>
							</TabsContent>
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
							<TabsContent value='times'>
								<div class='w-full md:w-4/6 xl:w-2/5'>
									<ReferenceCard times={reference.data?.time_by_task as TimeByTask} />
								</div>
							</TabsContent>

						</Tabs>
					</div>
				</Match>
			</Switch>
		</div >
	);
}

export default Reference;
