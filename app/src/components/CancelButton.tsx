import { useNavigate } from '@solidjs/router';
import { mergeProps } from 'solid-js';
import { Button } from './ui/Button';

function CancelButton(props: { to?: string; label?: string; class?: string }) {
	const merge = mergeProps({ label: 'Cancelar', to: '/' }, props);
	const navigate = useNavigate();

	return (
		<Button type='button' onclick={() => navigate(merge.to)} variant='destructive' class={merge.class}>
			{merge.label}
		</Button>
	);
}

export default CancelButton;
