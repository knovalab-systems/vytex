export type ResourceFilter = {
	name?: string;
	code?: string;
	colors?: number[];
	suppliers?: number[];
	state?: string;
};

export type FabricFilter = {
	name?: string;
	code?: string;
	colors?: number[];
	suppliers?: number[];
	state?: string;
};

export type OrderFilter = {
	status?: number[];
	startedDate?: string;
	createdDate?: string;
	finishedDate?: string;
	canceledDate?: string;
};
