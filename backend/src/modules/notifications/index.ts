/**
 * Public surface of the notifications module.
 *
 * RemindersService stays internal: it is a scheduled job wired inside this
 * module, not something another module calls.
 */
export { NotificationsService } from './notifications.service';
export type { AppNotification } from './notifications.repository';
