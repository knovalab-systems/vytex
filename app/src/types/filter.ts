import type { StateValues } from './state';

export type ResourceFilter = {
	name?: string;
	code?: string;
	colors?: number[];
	suppliers?: number[];
	state?: StateValues;
};

export type FabricFilter = {
	name?: string;
	code?: string;
	colors?: number[];
	suppliers?: number[];
	state?: StateValues;
};

export type OrderFilter = {
	status?: number[];
	startedDate?: string;
	createdDate?: string;
	finishedDate?: string;
	canceledDate?: string;
};

export type RoleFilter = {
	name?: string;
	origin?: RoleFilterOrigin;
};

export type UserFilter = {
	name?: string;
	username?: string;
	state?: StateValues;
	roles?: string[];
};

export type RoleFilterOrigin = 'Sistema' | 'Personalizado';
