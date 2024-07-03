import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import Loading from '~/components/Loading';
import ColorTable from '../components/ColorTable';
import { countColorsQuery, getColorsQuery } from '../requests/colorsGetRequests';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import { QUERY_LIMIT } from '~/utils/constants';
import { Button } from '~/components/ui/Button';
import { A } from '@solidjs/router';
import { COLORS_CREATE_PATH } from '~/utils/paths';
import { AiOutlinePlus } from 'solid-icons/ai';

function Colors() {
	const [page, setPage] = createSignal(1);
	const colors = createQuery(() => getColorsQuery(page()));
	const countColors = createQuery(() => countColorsQuery());
	const pages = createMemo<number>(() => {
		const count = countColors.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<div class='h-full flex flex-col'>
			<div class='mb-2'>
				<A href={COLORS_CREATE_PATH}>
					<Button class='bg-purple-600 hover:bg-purple-700'>
						Nuevo Color <AiOutlinePlus class='ml-2' size={22} />
					</Button>
				</A>
			</div>
			<Switch>
				<Match when={colors.isLoading || countColors.isLoading}>
					<Loading label='Cargando colores' />
				</Match>
				<Match when={colors.isSuccess && countColors.isSuccess}>
					<ColorTable colors={colors.data} />
					<Pagination
						class='pt-2 [&>*]:justify-center'
						count={pages()}
						page={page()}
						onPageChange={setPage}
						itemComponent={props => <PaginationItem page={props.page}>{props.page}</PaginationItem>}
						ellipsisComponent={() => <PaginationEllipsis />}
					>
						<PaginationPrevious />
						<PaginationItems />
						<PaginationNext />
					</Pagination>
				</Match>
			</Switch>
		</div>
	);
}

export default Colors;
