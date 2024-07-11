import type { RouteSectionProps } from '@solidjs/router';
import { DESIGNER_ROLE } from '~/envs/roles';
import MatchRole from './MatchRole';

export default function MatchDesigner(props: RouteSectionProps) {
	return <MatchRole role={DESIGNER_ROLE}>{props.children}</MatchRole>;
}
