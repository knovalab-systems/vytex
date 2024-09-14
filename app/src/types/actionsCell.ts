export type Icons = 'update' | 'details' | 'create' | 'start';

export type Action = {
	title: string;
	label: string;
	path: string;
	icon: Icons;
};
