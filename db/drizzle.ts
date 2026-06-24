// JSON database adapter — mimics Drizzle's db.query / insert / update / delete
// pattern so existing admin API routes keep working.
import { db as store } from "@/lib/db";
import type {
  Challenge,
  ChallengeOption,
  ChallengeProgress,
  Course,
  Lesson,
  ReadingAttempt,
  Unit,
  UserProgress,
  UserSubscription,
} from "./schema";

type TableName =
  | "courses"
  | "units"
  | "lessons"
  | "challenges"
  | "challengeOptions"
  | "challengeProgress"
  | "readingAttempts"
  | "userProgress"
  | "userSubscription";

const tables: Record<string, TableName> = {
  courses: "courses",
  units: "units",
  lessons: "lessons",
  challenges: "challenges",
  challengeOptions: "challengeOptions",
  challengeProgress: "challengeProgress",
  readingAttempts: "readingAttempts",
  userProgress: "userProgress",
  userSubscription: "userSubscription",
};

type AnyRecord = Record<string, unknown> & { id: number };

function queryBuilder(table: TableName) {
  return {
    findMany: (opts?: { where?: Record<string, unknown>; orderBy?: any; limit?: number; with?: any; columns?: any }) =>
      store.findMany(table, opts as any),
    findFirst: (opts?: { where?: Record<string, unknown> }) =>
      store.findFirst(table, opts as any),
  };
}

function makeDb() {
  const q: Record<string, ReturnType<typeof queryBuilder>> = {};
  for (const key of Object.keys(tables)) {
    q[key] = queryBuilder(tables[key]);
  }

  return {
    query: q,
    findFirst: <T = any>(table: string, opts?: any): T | null => store.findFirst(table, opts) as unknown as T | null,
    findMany: <T = any>(table: string, opts?: any): T[] => store.findMany(table, opts) as unknown as T[],
    deleteWhere: (table: string, predicate: any) => store.deleteWhere(table, predicate),
    insert: (table: any, values?: any) => {
      const name = tables[(table as any)?.name ?? table];
      if (values) {
        // values provided directly — execute insert immediately AND return chainable
        const result = store.insert(name, values);
        return { values: () => result, returning: () => result };
      }
      // Drizzle-style: db.insert(table).values(vals).returning()
      let inserted: AnyRecord[] = [];
      return {
        values: (vals: AnyRecord[]) => {
          inserted = store.insert(name, vals);
          return { returning: () => inserted };
        },
        returning: () => store.insert(name, []),
      };
    },
    update: (table: any, where?: any, values?: any) => {
      const name = tables[(table as any)?.name ?? table];
      if (where && values) {
        // Direct call: db.update(table, { field: value }, { ...changes })
        store.update(name, where, values);
        return { set: () => ({ where: () => {}, returning: () => [] }) };
      }
      return {
        set: (vals: AnyRecord) => ({
          where: (field: any, value: any) => {
            store.update(name, { [field]: value } as any, vals);
          },
          returning: () => [],
        }),
      };
    },
    delete: (table: any) => {
      const name = tables[(table as any)?.name ?? table];
      return {
        where: (field: any, value: any) => {
          store.deleteWhere(name, (item) => (item as any)[field] === value);
        },
        returning: () => [],
      };
    },
  };
}

const db = makeDb();
export default db;
