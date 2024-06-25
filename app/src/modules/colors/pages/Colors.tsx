import { createQuery } from '@tanstack/solid-query';
import { getColorsQuery } from '../requests/colorsGetRequests';
import { Match, Switch } from 'solid-js';
import Loading from '~/components/Loading';

function Colors() {
	const colors = createQuery(() => getColorsQuery(0));
	return (
		<div class='h-full flex flex-col'>
			<Switch>
				<Match when={colors.isLoading}>
					<Loading label='Cargando colores' />
				</Match>
				<Match when={colors.isSuccess}>
					<h2>Colors</h2>
				</Match>
			</Switch>
		</div>
	);
}

export default Colors;
