import { Input } from '~/components/ui/Input';

type FilterProps = {
	filterValue: string;
	setFilter: (value: string) => void;
	placeholder: string;
};

function FilterInput(props: FilterProps) {
	const handleInput = (e: Event) => {
		e.preventDefault();
		const target = e.target as HTMLInputElement;
		props.setFilter(target.value);
		console.log(props.filterValue);
	};

	return (
		<Input
			class='w-80 h-12 mb-2 text-xl focus:ring-gray-500'
			type='text'
			value={props.filterValue}
			onInput={handleInput}
			onPaste={(e: ClipboardEvent) => {
				props.setFilter(e.clipboardData?.getData('text/plain') ?? '');
			}}
			placeholder={props.placeholder}
		/>
	);
}

export default FilterInput;
