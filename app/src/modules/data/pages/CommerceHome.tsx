import { createQuery } from "@tanstack/solid-query";
import { Match, Switch } from "solid-js";
import ErrorMessage from "~/components/ErrorMessage";
import Loading from "~/components/Loading";
import OrdersByState from "../components/OrdersByState";
import { type CountOrdersBystateType, countOrdersBystateQuery } from "../requests/commerceHome";

function CommerceHome() {
    const ordersByState = createQuery(countOrdersBystateQuery);

    const isLoading = () => ordersByState.isLoading;
    const isError = () => ordersByState.isError;
    const isSuccess = () => ordersByState.isSuccess;


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
                    <div class='h-full w-full flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-2'>
                        <OrdersByState data={ordersByState.data as CountOrdersBystateType} />
                    </div>
                </Match>
            </Switch>
        </div>
    );
}

export default CommerceHome;