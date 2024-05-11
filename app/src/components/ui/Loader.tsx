import { cn } from '~/lib/utils';

function Loader(props: {
	class?: string;
}) {
	return (
		<div
			class={cn(
				'w-16 h-16 border-8 border-zinc-200 border-t-blue-500 border-b-blue-500 rounded-full animate-spin',
				props.class,
			)}
		/>
	);
}

export default Loader;
