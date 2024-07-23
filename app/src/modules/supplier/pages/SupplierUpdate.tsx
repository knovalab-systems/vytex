import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Match, Switch } from "solid-js";
import Loading from "~/components/Loading";
import SupplireUpdateForm from "../components/SupplierUpdateForm";
import { getSupplierQuery } from "../requests/supplierGet";

function SupplierUpdate() {
    const params = useParams();
    const supplier = createQuery(() => getSupplierQuery(Number(params.id)));

    return (
        <div class='flex items-center justify-center h-full'>
            <Switch>
                <Match when={supplier.isPending || supplier.isRefetching}>
                    <Loading label='Cargando proveedor' />
                </Match>
                <Match when={supplier.isSuccess}>
                    <SupplireUpdateForm supplier={supplier.data} />
                </Match>
            </Switch>

        </div>
    );
}

export default SupplierUpdate;