import type { JSXElement } from 'solid-js';
import type { Policy } from './core';

export interface NavPages {
	name: string;
	path: string;
	end?: boolean;
	icon: () => JSXElement;
}

export type PolicyNav = Extract<
	Policy,
	| 'ReadUsers'
	| 'ReadReferences'
	| 'ReadColors'
	//	| 'ReadCustoms'
	| 'ReadFabrics'
	| 'ReadResources'
	| 'ReadOrders'
	| 'ReadSuppliers'
	| 'ReadCorte'
	| 'ReadConfeccion'
	| 'ReadRoles'
>;
