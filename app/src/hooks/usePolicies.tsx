import { type JSXElement, createContext, useContext } from 'solid-js';
import type { Policy } from '~/types/core';

const PoliciesContext = createContext<PoliciesContext>({
	policies: [],
	hasPolicy: () => false,
});

type PoliciesContext = {
	policies: Policy[];
	hasPolicy: (policy: Policy) => boolean;
};

export function PoliciesProvider(props: { children: JSXElement; policies: Policy[] }) {
	const hasPolicy = (policy: Policy) => {
		for (const userPolicy of props.policies) {
			if (policy === userPolicy) {
				return true;
			}
		}
		return false;
	};

	return (
		<PoliciesContext.Provider value={{ policies: props.policies, hasPolicy }}>
			{props.children}
		</PoliciesContext.Provider>
	);
}

export function usePolicies() {
	return useContext(PoliciesContext);
}
