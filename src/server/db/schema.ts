import {
  int,
  text,
  singlestoreTable,
  index,
  singlestoreTableCreator,
  bigint,
} from "drizzle-orm/singlestore-core"

export const createTable = singlestoreTableCreator(
  (name) => `drive_tutorial_${name}`,
)

export const files = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    parent: bigint("parent", { mode: "number", unsigned: true }).notNull(),
    size: int("size").notNull(),
  },
  (t) => [index("parent_index_file").on(t.parent)],
)

export const folders = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: text("name").notNull(),
    parent: bigint("parent", { mode: "number", unsigned: true }),
  },
  (t) => [index("parent_index_folder").on(t.parent)],
)
