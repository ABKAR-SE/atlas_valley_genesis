import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { dbPath } from '../config/paths.js';

const adapter = new JSONFile(dbPath);
export const db = new Low(adapter, {
  users: {},
  tasks: [
    { id: '1', title: 'Complete 3 activity logs', points: 10 },
    { id: '2', title: 'Upload avatar metadata', points: 15 }
  ],
  activityFeed: []
});

export async function initDb() {
  await db.read();
}
