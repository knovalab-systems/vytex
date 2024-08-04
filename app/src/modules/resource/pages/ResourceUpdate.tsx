import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Match, Switch } from "solid-js";
import Loading from "~/components/Loading";
import { type Colors, useColors } from "~/hooks/useColors"
import { type Suppliers, useSuppliers } from "~/hooks/useSuppliers";
import ResourceUpdateForm from "../components/ResourceUpdateForm";
import { getResourceQuery } from "../requests/resourceGet";

function ResourceUpdate() {

    const params = useParams();
    const resource = createQuery(() => getResourceQuery(Number(params.id)));

    const { colorsQuery } = useColors();
    const { suppliersQuery } = useSuppliers();

    const isLoading = () => suppliersQuery.isLoading || colorsQuery.isLoading || resource.isLoading;

    const isSuccess = () => suppliersQuery.isSuccess && colorsQuery.isSuccess && resource.isSuccess;

    return (
        <div class='flex items-center justify-center h-full'>
            <Switch>
                <Match when={isLoading()}>
                    <Loading label='Cargando datos' />
                </Match>
                <Match when={isSuccess()}>
                    <ResourceUpdateForm colors={colorsQuery.data as Colors} suppliers={suppliersQuery.data as Suppliers} resource={resource.data} />
                </Match>
            </Switch>
        </div>
    );
}

export default ResourceUpdate;