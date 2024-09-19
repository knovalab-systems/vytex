import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import ColorUpdateForm from '../components/ColorUpdateForm';
import { getColorQuery } from '../requests/colorGet';

function ColorUpdate() {
	return (
		<AllowPolicies policies={['UpdateColors']}>
			<ColorUpdatePage />
		</AllowPolicies>
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
