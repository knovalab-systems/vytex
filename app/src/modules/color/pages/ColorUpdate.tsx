import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import Loading from '~/components/Loading';
import ColorUpdateForm from '../components/ColorUpdateForm';
import { getColorQuery } from '../requests/colorGet';

function ColorUpdate() {
	const params = useParams();
	const color = createQuery(() => getColorQuery(Number(params.id)));

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
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
