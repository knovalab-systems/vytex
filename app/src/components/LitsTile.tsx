function LitsTile(props: { support?: string; title?: string | null }) {
	return (
		<div class='flex-1 space-y-1'>
			<p class='font-medium leading-none'>{props.title}</p>
			<p class='text-sm text-muted-foreground'>{props.support}</p>
		</div>
	);
}

export default LitsTile;
