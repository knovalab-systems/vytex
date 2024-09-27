import { A } from '@solidjs/router';
import { AiOutlinePlus } from 'solid-icons/ai';
import { Show } from 'solid-js';
import { usePolicies } from '~/hooks/usePolicies';
import { cn } from '~/lib/utils';
import type { Policy } from '~/types/core';
import { Button } from './ui/Button';

function CreateButton(props: { policy: Policy; to: string; label?: string; class?: string; classIcon?: string }) {
	const { hasPolicy } = usePolicies();
	return (
		<Show when={hasPolicy(props.policy)}>
			<A href={props.to}>
				<Button variant='new' class={props.class}>
					<p class='text-nowrap'>{props.label ?? 'Nuevo'}</p>
					<AiOutlinePlus class={cn('ml-2', props.class)} size={22} />
				</Button>
			</A>
		</Show>
	);
}

export default CreateButton;
