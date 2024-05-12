import { Select } from '@kobalte/core/select';
import { AiOutlineCheck } from 'solid-icons/ai';
import { TiArrowUnsorted } from 'solid-icons/ti';

interface options {
    label: string;
    value: string;
}

interface SelectOptionsProps {
    options: { label: string; value: string }[];
    placeholder: string;
    setSelect: (value: string) => void;
}

function SelectOptions({ options, placeholder, setSelect }: SelectOptionsProps) {
    return (
        <Select
            options={options}
            optionValue={option => option.value}
            optionTextValue={option => option.label}
            onChange={option => setSelect(option.value)}
            placeholder={placeholder}

            itemComponent={props => (
                <Select.Item item={props.item} class='flex justify-between items-center h-8 px-2'>
                    <Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
                    <Select.ItemIndicator class='h-5 w-5 flex items-center justify-center'>
                        <AiOutlineCheck />
                    </Select.ItemIndicator>
                </Select.Item>
            )}
        >
            <Select.Trigger
                class='inline-flex items-center justify-between w-80 rounded-md px-4 h-12 bg-white border border-gray-300 text-gray-700 transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                aria-label='User Status'
            >
                <Select.Value<options> class='overflow-hidden overflow-ellipsis whitespace-nowrap'>
                    {state => <span>{state.selectedOption().label}</span>}
                </Select.Value>
                <Select.Icon class='h-5 w-5 flex-none'>
                    <TiArrowUnsorted />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content class='bg-white rounded-md border border-gray-300 shadow-md transform transition-transform origin-top animate-slide-up'>
                    <Select.Listbox class='overflow-y-auto max-h-90 p-2' />
                </Select.Content>
            </Select.Portal>
        </Select>
    );
}

export default SelectOptions;
