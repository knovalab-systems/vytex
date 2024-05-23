import { createRoot, createSignal } from 'solid-js';

function createRole() {
	const [role, setRole] = createSignal<string | null>(null);
	return { role, setRole };
}

export default createRoot(createRole);
