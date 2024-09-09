import { type JSXElement, createContext, useContext } from 'solid-js';
import { POLICIES, type Policy } from '~/constants/policies';

const PoliciesContext = createContext<PoliciesContext>({
	policies: [],
	hasPolicy: () => false,
});

type PoliciesContext = {
	policies: number[];
	hasPolicy: (policy: Policy) => boolean;
};

export function PoliciesProvider(props: { children: JSXElement; policies: number[] }) {
	const hasPolicy = (policy: Policy) => {
		for (const userPolicy of props.policies) {
			if (policy === POLICIES[userPolicy]) {
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
