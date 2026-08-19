/**
 * Public surface of the projects module.
 *
 * The repository is exported deliberately: `risks` and `submissions` need
 * project rows without the full service, and that is a blessed dependency
 * (REFACTOR-PLAN v2 section 4), not a leak.
 *
 * `projects.module` is imported directly by consumers, as composition wiring
 * rather than policy.
 */
export { ProjectsService } from './projects.service';
export { ProjectsRepository } from './projects.repository';
export type {
  Project,
  ProjectDetail,
  ProjectListRow,
  ProjectListStats,
} from './projects.repository';
export { CreateProjectDto } from './dto/create-project.dto';
