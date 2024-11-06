import { cn } from '~/lib/utils';

function LitsTile(props: { support?: string; title?: string | null; classTitle?: string }) {
	return (
		<div class='flex-1 space-y-1'>
			<p class={cn('font-medium leading-none', props.classTitle)}>{props.title}</p>
			<p class='text-sm text-muted-foreground'>{props.support}</p>
		</div>
	);
}

export default LitsTile;
