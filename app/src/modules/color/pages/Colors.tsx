import { A } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { AiOutlinePlus } from 'solid-icons/ai';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/Button';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import { QUERY_LIMIT } from '~/constants/http';
import { COLORS_CREATE_PATH } from '~/constants/paths';
import ColorTable from '../components/ColorTable';
import { countColorsQuery, getColorsQuery } from '../requests/colorGet';

function Colors() {
	return (
		<AllowPolicies policies={['ReadColors']}>
			<ColorsPage />
		</AllowPolicies>
	);
}

function ColorsPage() {
	const [page, setPage] = createSignal(1);
	const colors = createQuery(() => getColorsQuery(page()));
	const countColors = createQuery(() => countColorsQuery());
	const pages = createMemo<number>(() => {
		const count = countColors.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<div class='h-full flex flex-col gap-2'>
			<div>
				<A href={COLORS_CREATE_PATH}>
					<Button variant='new'>
						Nuevo Color <AiOutlinePlus class='ml-2' size={22} />
					</Button>
				</A>
			</div>
			<Switch>
				<Match when={colors.isError || countColors.isError}>
					<ErrorMessage title='Error al cargar colores' />
				</Match>
				<Match when={colors.isLoading || countColors.isLoading}>
					<Loading label='Cargando colores' />
				</Match>
				<Match when={colors.isSuccess && countColors.isSuccess}>
					<ColorTable colors={colors.data} />
					<Pagination
						class='[&>*]:justify-center'
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
