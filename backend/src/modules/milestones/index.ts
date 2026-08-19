/**
 * Public surface of the milestones module.
 *
 * The repository is exported deliberately for `submissions`, which needs
 * milestone rows without the full service (REFACTOR-PLAN v2 section 4).
 */
export { MilestonesService } from './milestones.service';
export { MilestonesRepository } from './milestones.repository';
export type { Milestone, MilestoneListItem } from './milestones.repository';
export { CreateMilestoneDto } from './dto/create-milestone.dto';
