import type { StateValues } from './state';

export type ResourceFilter = {
	ids: number[];
	name?: string;
	code?: string;
	colors?: number[];
	suppliers?: number[];
	state?: StateValues;
};

export type FabricFilter = {
	ids?: number[];
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

export type TaskControlFilter = {
	id?: number;
	order?: number;
	tasks?: number[];
	status?: number[];
};

export type ReferenceFilter = {
	code?: string;
	state?: StateValues;
	colors?: number[];
};
