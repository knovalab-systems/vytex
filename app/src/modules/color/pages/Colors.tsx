import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import Loading from '~/components/Loading';
import ColorTable from '../components/ColorTable';
import { getColorsQuery } from '../requests/colorsGetRequests';

function Colors() {
	const colors = createQuery(() => getColorsQuery(0));
	return (
		<div class='h-full flex flex-col'>
			<Switch>
				<Match when={colors.isLoading}>
					<Loading label='Cargando colores' />
				</Match>
				<Match when={colors.isSuccess}>
					<ColorTable colors={colors.data} />
				</Match>
			</Switch>
		</div>
	);
}

export default Colors;
