import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

/**
 * Data access for the code tables.
 *
 * Every method takes the physical table name, because this module is generic
 * over code tables by nature — but it never decides *which* table is legal.
 * That whitelist, the cache, and the per-table column rules stay in the
 * service, which owns the policy (REFACTOR-PLAN v2, Phase 0: seam first).
 */
@Injectable()
export class LookupsRepository {
  constructor(private readonly db: DatabaseService) {}

  /** Active rows only, in display order — what dropdowns show. */
  async listActive<T>(table: string, select: string): Promise<T[]> {
    const { data, error } = await this.db.client
      .from(table)
      .select(select)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw toHttpException(error, `lookups.${table}`);
    // The dynamic select string defeats supabase-js's literal-type inference.
    return (data ?? []) as unknown as T[];
  }

  /** Every row including inactive ones, for the admin grid. */
  async listAll<T>(table: string, select: string): Promise<T[]> {
    const { data, error } = await this.db.client
      .from(table)
      .select(select)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('name', { ascending: true });
    if (error) throw toHttpException(error, `lookups.admin.${table}`);
    return (data ?? []) as unknown as T[];
  }

  async insert<T>(
    table: string,
    row: Record<string, unknown>,
    select: string,
  ): Promise<T> {
    const { data, error } = await this.db.client
      .from(table)
      .insert(row)
      .select(select)
      .single();
    if (error) throw toHttpException(error, `lookups.insert.${table}`);
    return data as unknown as T;
  }

  /** Null when no row carries that id, so the caller can 404. */
  async update<T>(
    table: string,
    id: string,
    patch: Record<string, unknown>,
    select: string,
  ): Promise<T | null> {
    const { data, error } = await this.db.client
      .from(table)
      .update(patch)
      .eq('id', id)
      .select(select)
      .maybeSingle();
    if (error) throw toHttpException(error, `lookups.update.${table}`);
    return (data as unknown as T) ?? null;
  }
}
