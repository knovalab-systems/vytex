import type { RouteSectionProps } from '@solidjs/router';
import MatchRole from './MatchRole';
import { ADMIN_ROLE } from '~/envs/roles';

export default function MatchAdmin(props: RouteSectionProps) {
	return <MatchRole role={ADMIN_ROLE}>{props.children}</MatchRole>;
}
