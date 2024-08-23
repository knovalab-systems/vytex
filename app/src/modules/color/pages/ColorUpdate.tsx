import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowRoles from '~/components/AllowRoles';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import ColorUpdateForm from '../components/ColorUpdateForm';
import { getColorQuery } from '../requests/colorGet';

function ColorUpdate() {
	return (
		<AllowRoles roles={['designer']}>
			<ColorUpdatePage />
		</AllowRoles>
	);
}

function ColorUpdatePage() {
	const params = useParams();
	const color = createQuery(() => getColorQuery(Number(params.id)));

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={color.isError}>
					<ErrorMessage title='Error al cargar color' />
				</Match>
				<Match when={color.isFetching}>
					<Loading label='Cargando color' />
				</Match>
				<Match when={color.isError}>Error</Match>
				<Match when={color.isSuccess}>{<ColorUpdateForm color={color.data} />}</Match>
			</Switch>
		</div>
	);
}

export default ColorUpdate;
