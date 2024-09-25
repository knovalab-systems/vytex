import { useNavigate } from '@solidjs/router';
import { For, createEffect, createMemo, createSignal } from 'solid-js';
import toast from 'solid-toast';
import CancelButton from '~/components/CancelButton';
import { Button } from '~/components/ui/Button';
import { ORDERS_PATH } from '~/constants/paths';
import { SIZES } from '~/constants/sizes';
import { useColors } from '~/hooks/useColors';
import { useOrderStatus } from '~/hooks/useOrderStatus';
import type { GetOrderStart } from '../request/orderGet';
import { updateOrderRequest } from '../request/orderUpdate';

type DataUsage = {
	name: string;
	color: string;
	usage: number;
};

function OrderStartCard(props: { order: GetOrderStart }) {
	const { getColorsRecord } = useColors();
	const [disabled, setDisabled] = createSignal(false);
	const navigate = useNavigate();
	const { getStatuByValue } = useOrderStatus();
	const created = () => getStatuByValue('created');
	const started = () => getStatuByValue('started');

	const resourcesUsage = createMemo(() => {
		const arr: DataUsage[] = [];
		for (const resource of props.order.color_by_reference?.resources || []) {
			const r = {
				name: resource.resource?.name as string,
				color: getColorsRecord()[resource.resource?.color_id as number]?.hex || '',
				usage: 0,
			};
			let total = 0;
			for (const size of SIZES) {
				const quantity = props.order[size] ?? 0;
				const usage = resource[size] ?? 0;
				total = total + quantity * usage;
			}
			r.usage = total;
			arr.push(r);
		}
		return arr;
	});

	const fabricsUsage = createMemo(() => {
		const arr = [];
		for (const fabric of props.order.color_by_reference?.fabrics || []) {
			const r = {
				name: fabric.fabric?.name as string,
				color: getColorsRecord()[fabric.fabric?.color_id as number]?.hex || '',
				usage: 0,
			};
			let total = 0;
			for (const size of SIZES) {
				const quantity = props.order[size] ?? 0;
				const usage = fabric[size] ?? 0;
				total = total + quantity * usage;
			}
			r.usage = total;
			arr.push(r);
		}
		return arr;
	});

	createEffect(() => {
		if (created()?.id !== props.order.order_state_id) {
			navigate(ORDERS_PATH);
		}
	});

	const handleStart = async () => {
		setDisabled(true);
		updateOrderRequest(props.order.id, { order_state_id: started()?.id })
			.then(() => {
				toast.success('La orden inició con éxito.');
				navigate(ORDERS_PATH);
			})
			.catch(() => toast.error('Error al iniciar la orden.'))
			.finally(() => {
				setDisabled(false);
			});
	};

	return (
		<div class='min-w-[50%]'>
			<div class='p-4 m-4 gap-4 bg-white border-gray-100 shadow-md rounded-md border flex justify-between'>
				<div class='flex-1'>
					<p class='text-center mb-2 font-bold text-xl'>Insumos</p>
					<DataUsage data={resourcesUsage()} />
				</div>
				<div class='border-l-2 bg-slate-600 w-0' />
				<div class='flex-1'>
					<p class='text-center mb-2 font-bold text-xl'>Telas</p>
					<DataUsage data={fabricsUsage()} />
				</div>
			</div>
			<div>
				<div class='flex justify-between m-4'>
					<CancelButton to={ORDERS_PATH} />
					<Button type='submit' onclick={handleStart} disabled={disabled()} variant='success'>
						Iniciar
					</Button>
				</div>
			</div>
		</div>
	);
}

function DataUsage(props: { data: DataUsage[] }) {
	return (
		<div class='grid grid-cols-3 text-center'>
			<p class='font-semibold mb-2'>Color</p>
			<p class='font-semibold mb-2'>Nombre</p>
			<p class='font-semibold mb-2'>Consumo</p>
			<For each={props.data}>
				{resource => (
					<>
						<div class='h-5 w-5 m-auto border' style={{ background: resource.color }} />
						<p>{resource.name}</p>
						<p>{resource.usage}</p>
					</>
				)}
			</For>
		</div>
	);
}

export default OrderStartCard;
