// src/db.ts
import { openDB } from 'idb';

const dbPromise = openDB('my-database', 1, {
  upgrade(db) {
    db.createObjectStore('my-store');
  },
});

export const setItem = async (key: string, value: any) => {
  const db = await dbPromise;
  await db.put('my-store', value, key);
};

export const getItem = async (key: string) => {
  const db = await dbPromise;
  return await db.get('my-store', key);
};
