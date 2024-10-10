import { VsFilter, VsFilterFilled } from 'solid-icons/vs';
import { type JSXElement, Show } from 'solid-js';
import { cn } from '~/lib/utils';
import { Button } from './ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';

function FilterButton(props: {
	children?: JSXElement;
	active?: boolean;
	open?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
}) {
	return (
		<Popover open={props.open} onOpenChange={props.onOpenChange}>
			<PopoverTrigger>
				<Button
					variant='ghost'
					title='Ver filtros'
					class={cn(
						'ml-1 shadow-md border-[2.8px] border-gray-400 rounded-2xl hover:border-black hover:text-black',
						props.active ? 'border-gray-600 text-gray-600 shadow-indigo-400' : 'text-gray-400',
					)}
				>
					<p class='font-bold font-mono'>Filtros</p>
					<Show when={props.active} fallback={<VsFilter size={28} title='Inactivo' />}>
						<VsFilterFilled title='Activo' size={28} />
					</Show>
				</Button>
			</PopoverTrigger>
			<PopoverContent class='w-auto'>{props.children}</PopoverContent>
		</Popover>
	);
}

export default FilterButton;
