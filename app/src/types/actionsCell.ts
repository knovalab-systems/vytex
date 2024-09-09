export type Icons = 'update' | 'details' | 'create';

export type Action = {
	title: string;
	label: string;
	path: string;
	icon: Icons;
};
