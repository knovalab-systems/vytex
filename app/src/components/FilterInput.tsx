import { Input } from '~/components/ui/Input';

type FilterProps = {
	filterValue: string;
	setFilter: (value: string) => void;
	placeholder: string;
};

function FilterInput({ setFilter, placeholder, filterValue }: FilterProps) {
	const handleInput = (e: Event) => {
		e.preventDefault();
		const target = e.target as HTMLInputElement;
		setFilter(target.value);
	};

	return (
		<Input
			class='w-80 h-12 mb-2 text-xl focus:ring-gray-500'
			type='text'
			value={filterValue}
			onInput={handleInput}
			onPaste={
				(e: ClipboardEvent) => {
					setFilter(e.clipboardData?.getData('text/plain') ?? '');
				}
			}
			placeholder={placeholder}
		/>
	);
}

export default FilterInput;
