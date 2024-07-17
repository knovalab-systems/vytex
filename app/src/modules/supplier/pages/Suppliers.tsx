import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import Loading from '~/components/Loading';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import { QUERY_LIMIT } from '~/constants/http';
import SupplierTable from '../components/SupplierTable';
import { countSuppliersQuery, getSuppliersQuery } from '../requests/supplierGet';
import { SUPPLIERS_CREATE_PATH } from '~/constants/paths';
import { A } from '@solidjs/router';
import { Button } from '~/components/ui/Button';
import { AiOutlinePlus } from 'solid-icons/ai';

function Suppliers() {
	const [page, setPage] = createSignal(1);
	const suppliers = createQuery(() => getSuppliersQuery(page()));
	const countSuppliers = createQuery(() => countSuppliersQuery());
	const pages = createMemo<number>(() => {
		const count = countSuppliers.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<div class='h-full w-full flex flex-col'>
			<div class='mb-2'>
				<A href={SUPPLIERS_CREATE_PATH}>
					<Button class='bg-practice_date h-12 hover:bg-blue-800'>
						Nuevo Proveedor <AiOutlinePlus class='ml-2' size={22} />
					</Button>
				</A>
			</div>
			<Switch>
				<Match when={suppliers.isLoading || countSuppliers.isLoading}>
					<Loading label='Cargando proveedores' />
				</Match>
				<Match when={suppliers.isSuccess && countSuppliers.isSuccess}>
					<SupplierTable suppliers={suppliers.data} />
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

export default Suppliers;
