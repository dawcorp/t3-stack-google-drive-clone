import "server-only"

import { eq } from "drizzle-orm"
import { db } from "~/server/db"
import {
  files_table as FileSchema,
  folders_table as FolderSchema,
} from "~/server/db/schema"

export const QUERIES = {
  getAllParentsForFolder: async function getAllParentsForFolder(
    folderId: number,
  ) {
    const parents = []
    let currentId: number | null = folderId
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(FolderSchema)
        .where(eq(FolderSchema.id, currentId))
      if (!folder[0]) {
        throw new Error("Parent folder not found")
      }
      parents.unshift(folder[0])
      currentId = folder[0]?.parent
    }
    return parents
  },
  getFolders: function getFolders(parsedFolderId: number) {
    return db
      .select()
      .from(FolderSchema)
      .where(eq(FolderSchema.parent, parsedFolderId))
  },
  getFiles: function getFiles(parsedFolderId: number) {
    return db
      .select()
      .from(FileSchema)
      .where(eq(FileSchema.parent, parsedFolderId))
  },
}
