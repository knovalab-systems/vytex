import { createSignal } from 'solid-js';
import { Input } from '~/components/ui/Input';

type FilterProps = {
	setFilter: (value: string) => void;
	placeholder: string;
};

function FilterInput({ setFilter, placeholder }: FilterProps) {
	const [filter, setLocalFilter] = createSignal('');

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		setLocalFilter(target.value);
		setFilter(target.value);
	};

	return (
		<Input
			class='w-80 h-12 mb-2 text-xl focus:ring-gray-500'
			type='text'
			value={filter()}
			onInput={handleInput}
			placeholder={placeholder}
		/>
	);
}

export default FilterInput;
