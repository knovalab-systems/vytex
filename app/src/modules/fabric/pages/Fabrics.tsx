import { createQuery } from "@tanstack/solid-query";
import { Match, Switch, createMemo, createSignal } from "solid-js";
import Loading from "~/components/Loading";
import {
    Pagination,
    PaginationEllipsis,
    PaginationItem,
    PaginationItems,
    PaginationNext,
    PaginationPrevious,
} from '~/components/ui/Pagination';
import { QUERY_LIMIT } from "~/utils/constants";
import FabricTable from "../components/FabricTable";
import { countFabricsQuery, getFabricsQuery } from "../request/fabricsGetRequests";

function Fabrics() {
    const [page, setPage] = createSignal(1);
    const fabrics = createQuery(() => getFabricsQuery(page()));
    const countFabrics = createQuery(() => countFabricsQuery());
    const pages = createMemo<number>(() => {
        const count = countFabrics.data?.at(0)?.count || 1;
        const safe = count === 0 ? 1 : count;
        return Math.ceil(safe / QUERY_LIMIT)
    });

    return (
        <div class='h-full flex flex-col'>
            <Switch>
                <Match when={fabrics.isLoading || countFabrics.isLoading}>
                    <Loading label="Cargando telas" />
                </Match>
                <Match when={fabrics.isSuccess && countFabrics.isSuccess}>
                    <FabricTable fabrics={fabrics.data} />
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
    )
}

export default Fabrics;