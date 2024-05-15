import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

interface SelectOptionsProps {
	options: { label: string; value: string | number }[];
	placeholder: string;
	setSelect: (value: string) => void;
	value: string;
	class?: string;
}

function SelectOptions(props: SelectOptionsProps) {
	const [, rest] = splitProps(props, ['options', 'placeholder', 'setSelect', 'value', 'class']);

	const handleChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		props.setSelect(target.value);
	};

	return (
		<select
			value={props.value}
			onchange={handleChange}
			class={cn(
				'inline-flex items-center justify-between w-80 rounded-md px-4 h-12 bg-white border border-gray-300 text-gray-700 transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500',
				props.class,
			)}
			aria-label='User Status'
			{...rest}
		>
			<option value=''>{props.placeholder}</option>
			{props.options.map(option => (
				<option value={option.value}>{option.label}</option>
			))}
		</select>
	);
}

export default SelectOptions;