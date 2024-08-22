import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';
import { cn } from '~/lib/utils';

type FilterProps = Component<{
	filterValue: string;
	setFilter: (value: string) => void;
	placeholder: string;
	class?: string;
}>;

const FilterInput: FilterProps = props => {
	const [, rest] = splitProps(props, ['filterValue', 'setFilter', 'placeholder', 'class']);

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		props.setFilter(target.value);
	};

	return (
		<input
			type='text'
			value={props.filterValue}
			onInput={handleInput}
			onPaste={(e: ClipboardEvent) => {
				const pasteValue = e.clipboardData?.getData('text/plain') ?? '';
				props.setFilter(pasteValue);
			}}
			placeholder={props.placeholder}
			class={cn(
				'w-80 p-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300',
				props.class,
			)}
			{...rest}
		/>
	);
};

export default FilterInput;
