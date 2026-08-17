import { ProjectSectionsService } from './project-sections.service';

/**
 * Characterization test, moved here from projects.service.spec.ts when the
 * fan-out left ProjectsService (REFACTOR-PLAN 1b). It pins the one thing that
 * can silently break: a response key wired to the wrong collaborator.
 */
describe('ProjectSectionsService', () => {
  const PROJECT = 'p-1';

  function build() {
    // The resolved value doubles as an identity tag, so a mis-wired key shows
    // up as the wrong section name rather than as an indistinguishable [].
    const section = (name: string) => ({
      list: jest.fn().mockResolvedValue([name]),
    });
    const sections = {
      milestones: section('milestones'),
      outcomes: section('outcomes'),
      actionItems: section('actionItems'),
      links: section('links'),
      resources: section('resources'),
      issues: section('issues'),
      risks: section('risks'),
      submissions: section('submissions'),
      updates: section('updates'),
      statusReports: section('statusReports'),
      attachments: section('attachments'),
    };
    const deps = [
      sections.milestones,
      sections.outcomes,
      sections.actionItems,
      sections.links,
      sections.resources,
      sections.issues,
      sections.risks,
      sections.submissions,
      sections.updates,
      sections.statusReports,
      sections.attachments,
    ] as unknown as ConstructorParameters<typeof ProjectSectionsService>;

    return { service: new ProjectSectionsService(...deps), sections };
  }

  it('maps every response key to its own collaborator', async () => {
    const { service, sections } = build();

    await expect(service.list(PROJECT)).resolves.toEqual({
      milestones: ['milestones'],
      outcomes: ['outcomes'],
      actionItems: ['actionItems'],
      links: ['links'],
      resources: ['resources'],
      issues: ['issues'],
      risks: ['risks'],
      submissions: ['submissions'],
      updates: ['updates'],
      statusReports: ['statusReports'],
      attachments: ['attachments'],
    });
    for (const s of Object.values(sections)) {
      expect(s.list).toHaveBeenCalledWith(PROJECT);
    }
  });
});
