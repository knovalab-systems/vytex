import { createQuery } from "@tanstack/solid-query";
import { Match, Switch } from "solid-js";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import CustomsByClient from "../components/CustomsByClient";
import OrdersByState from "../components/OrdersByState";
import { type CountCustomsByClientType, type CountOrdersBystateIdType, type CountOrdersBystateType, countCustomsByClientQuery, countOrdersBystateIdQuery, countOrdersBystateQuery } from "../requests/commerceHome";

function CommerceHome() {
    const ordersByState = createQuery(countOrdersBystateQuery);
    const ordersByStateId = createQuery(countOrdersBystateIdQuery);
    const customsByClient = createQuery(countCustomsByClientQuery)

    const isLoading = () => ordersByState.isLoading || ordersByStateId.isLoading || customsByClient.isLoading;
    const isError = () => ordersByState.isError || ordersByStateId.isError || customsByClient.isError;
    const isSuccess = () => ordersByState.isSuccess && ordersByStateId.isSuccess && customsByClient.isSuccess;

    return (
        <div class='h-full w-full'>
            <Switch>
                <Match when={isError()}>
                    <ErrorMessage title='Error al cargar información de pedidos y ordenes' />
                </Match>
                <Match when={isLoading()}>
                    <Loading label='Cargando información pedidos y ordenes' />
                </Match>
                <Match when={isSuccess()}>
                    <div class='h-full w-full flex flex-col md:grid md:grid-cols-2 gap-2'>
                        <OrdersByState
                            data={ordersByState.data as CountOrdersBystateType}
                            dataById={ordersByStateId.data as CountOrdersBystateIdType}
                        />
                        <CustomsByClient data={customsByClient.data as CountCustomsByClientType} />
                        <div class='col-span-2'>
                            <CustomsByClient data={customsByClient.data as CountCustomsByClientType} />
                        </div>
                    </div>
                </Match>
            </Switch>
        </div>
    );
}

export default CommerceHome;