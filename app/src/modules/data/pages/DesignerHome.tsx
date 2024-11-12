import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import ColorsByState from '../components/ColorsByState';
import FabricsByState from '../components/FabricsByState';
import ReferencesByState from '../components/ReferencesByState';
import ResourcesByState from '../components/ResourcesByState';
import {
	type CountColorsByStateType,
	type CountFabricsByStateType,
	type CountReferencesByStateType,
	type CountResourceByStateType,
	countColorsByStateQuery,
	countFabricsByStateQuery,
	countReferencesByStateQuery,
	countResourceByStateQuery,
} from '../requests/designerHome';

function DesignerHome() {
	const colorsByState = createQuery(countColorsByStateQuery);
	const referencesByState = createQuery(countReferencesByStateQuery);
	const fabricsByState = createQuery(countFabricsByStateQuery);
	const resourcesByState = createQuery(countResourceByStateQuery);

	const isLoading = () =>
		colorsByState.isLoading || referencesByState.isLoading || fabricsByState.isLoading || resourcesByState.isLoading;
	const isError = () =>
		colorsByState.isError || referencesByState.isError || fabricsByState.isError || resourcesByState.isError;
	const isSuccess = () =>
		colorsByState.isSuccess && referencesByState.isSuccess && fabricsByState.isSuccess && resourcesByState.isSuccess;

	return (
		<div class='h-full w-full'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar información de telas, colores, insumos y referencias' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando información de telas, colores, insumos y referencias' />
				</Match>
				<Match when={isSuccess()}>
					<div class='h-full w-full flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-2'>
						<ColorsByState data={colorsByState.data as CountColorsByStateType} />
						<ReferencesByState data={referencesByState.data as CountReferencesByStateType} />
						<FabricsByState data={fabricsByState.data as CountFabricsByStateType} />
						<ResourcesByState data={resourcesByState.data as CountResourceByStateType} />
					</div>
				</Match>
			</Switch>
		</div>
	);
}

export default DesignerHome;
