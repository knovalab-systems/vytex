import {
	aggregate,
	readDisabledUsers,
	readEnabledUsers,
	readUserByName,
	readUserByRole,
	readUserByUsername,
	readUsers,
} from '@vytex/client';
import { client } from '~/utils/client';
import { QUERY_LIMIT, USER_STATUS } from '~/utils/constants';

export async function getUsers(page: number) {
	return await client.request(
		readUsers({
			page: page | 0,
			limit: QUERY_LIMIT,
		}),
	);
}

export async function getUsersbyName(name: string, page: number) {
	return await client.request(
		readUserByName(name, {
			page: page | 0,
			limit: QUERY_LIMIT,
		}),
	);
}

export async function getUsersbyUsername(username: string, page: number) {
	return await client.request(
		readUserByUsername(username, {
			page: page | 0,
			limit: QUERY_LIMIT,
		}),
	);
}

export async function getDisabledUsers(page: number) {
	return await client.request(
		readDisabledUsers({
			page: page | 0,
			limit: QUERY_LIMIT,
		}),
	);
}

export async function getEnabledUsers(page: number) {
	return await client.request(
		readEnabledUsers({
			page: page | 0,
			limit: QUERY_LIMIT,
		}),
	);
}

export async function getUsersByRole(roleId: number, page: number) {
	return await client.request(
		readUserByRole(roleId, {
			page: page | 0,
			limit: QUERY_LIMIT,
		}),
	);
}

export async function countUsers() {
	return await client.request(
		aggregate('vytex_users', {
			aggregate: { count: '*' },
		}),
	);
}

export const getFetchFunction = (
	name: string,
	username: string,
	status: string,
	currentPage: number,
	roleId: number,
) => {
	const fetchFunctions = {
		name: name ? () => getUsersbyName(name, currentPage) : null,
		username: username ? () => getUsersbyUsername(username, currentPage) : null,
		status: status
			? status === USER_STATUS.inactive
				? () => getDisabledUsers(currentPage)
				: () => getEnabledUsers(currentPage)
			: null,
		roleId: roleId ? () => getUsersByRole(roleId, currentPage) : null,
		default: () => getUsers(currentPage),
	};

	const key =
		Object.keys(fetchFunctions).find(
			key => fetchFunctions[key as 'name' | 'username' | 'status' | 'default'] !== null,
		) || 'default';
	return { fetchFunction: fetchFunctions[key as 'name' | 'username' | 'status' | 'default'], key };
};

export type GetUsersType = Awaited<ReturnType<typeof getUsers>> | undefined;
