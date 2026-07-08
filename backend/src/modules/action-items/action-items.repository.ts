import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface ActionItem {
  id: string;
  project_id: string;
  milestone_id: string | null;
  title: string;
  description: string | null;
  type_id: string | null;
  role_id: string | null;
  due_date: string | null;
  status: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ActionItemListItem extends ActionItem {
  type: { name: string } | null;
  role: { name: string } | null;
  milestone: { name: string } | null;
  owners: Array<{
    slot: number;
    user_id: string;
    profile: { full_name: string | null; email: string | null } | null;
  }>;
}

export interface ActionItemComment {
  id: string;
  action_item_id: string;
  body: string;
  created_at: string;
  author: { full_name: string | null; email: string | null } | null;
}

const COLUMNS =
  'id, project_id, milestone_id, title, description, type_id, role_id, due_date, status, tags, created_at, updated_at';

@Injectable()
export class ActionItemsRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('action_items');
  }

  async insert(row: Record<string, unknown>): Promise<ActionItem> {
    const { data, error } = await this.table
      .insert(row)
      .select(COLUMNS)
      .single();
    if (error) throw toHttpException(error, 'actionItems.insert');
    return data as unknown as ActionItem;
  }

  async insertOwners(actionItemId: string, ownerIds: string[]): Promise<void> {
    if (!ownerIds.length) return;
    const rows = ownerIds.map((user_id, i) => ({
      action_item_id: actionItemId,
      user_id,
      slot: i + 1,
    }));
    const { error } = await this.db.client
      .from('action_item_owners')
      .insert(rows);
    if (error) throw toHttpException(error, 'actionItems.insertOwners');
  }

  async findByProject(projectId: string): Promise<ActionItemListItem[]> {
    const { data, error } = await this.table
      .select(
        `${COLUMNS},
         type:action_item_types ( name ),
         role:project_roles ( name ),
         milestone:milestones ( name ),
         owners:action_item_owners (
           slot, user_id,
           profile:profiles!user_id ( full_name, email )
         )`,
      )
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });
    if (error) throw toHttpException(error, 'actionItems.findByProject');
    return (data ?? []) as unknown as ActionItemListItem[];
  }

  async findOne(
    projectId: string,
    actionItemId: string,
  ): Promise<ActionItemListItem | null> {
    const { data, error } = await this.table
      .select(
        `${COLUMNS},
         type:action_item_types ( name ),
         role:project_roles ( name ),
         milestone:milestones ( name ),
         owners:action_item_owners (
           slot, user_id,
           profile:profiles!user_id ( full_name, email )
         )`,
      )
      .eq('project_id', projectId)
      .eq('id', actionItemId)
      .maybeSingle();
    if (error) throw toHttpException(error, 'actionItems.findOne');
    return (data as unknown as ActionItemListItem) ?? null;
  }

async listComments(actionItemId: string): Promise<ActionItemComment[]> {
    const { data, error } = await this.db.client
      .from('action_item_comments')
      .select(
        `id, action_item_id, body, created_at,
         author:profiles!author_id ( full_name, email )`,
      )
      .eq('action_item_id', actionItemId)
      .order('created_at', { ascending: true });
    if (error) throw toHttpException(error, 'actionItems.listComments');
    return (data ?? []) as unknown as ActionItemComment[];
  }

  async insertComment(
    actionItemId: string,
    body: string,
    authorId: string,
  ): Promise<ActionItemComment> {
    const { data, error } = await this.db.client
      .from('action_item_comments')
      .insert({ action_item_id: actionItemId, body, author_id: authorId })
      .select(
        `id, action_item_id, body, created_at,
         author:profiles!author_id ( full_name, email )`,
      )
      .single();
    if (error) throw toHttpException(error, 'actionItems.insertComment');
    return data as unknown as ActionItemComment;
  }  
}