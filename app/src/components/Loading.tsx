import { mergeProps } from 'solid-js';
import Loader from './ui/Loader';

function Loading(props: {
	label?: string;
	classCircle?: string;
}) {
	const merge = mergeProps({ label: 'Cargando...' }, props);
	return (
		<div class='flex flex-col items-center justify-center w-full h-full flex-1'>
			<Loader class={merge.classCircle} />
			<p class='mt-2 font-semibold text-gray-500'>{merge.label}</p>
		</div>
	);
}

export default Loading;
