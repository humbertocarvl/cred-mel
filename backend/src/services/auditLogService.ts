import pool from '../config/database';

export async function logAction(userId: number | null, action: string, details: string) {
  await pool.query(
    'INSERT INTO "AuditLog" ("userId", action, details, "created_at") VALUES ($1, $2, $3, NOW())',
    [userId, action, details]
  );
}
