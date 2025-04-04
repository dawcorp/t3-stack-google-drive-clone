import { db } from "~/server/db"
import { mockFolders, mockFiles } from "~/lib/mock-data"
import {
  files_table as FileSchema,
  folders_table as FolderSchema,
} from "~/server/db/schema"

export default function SandBoxPage() {
  return (
    <div className="flex flex-col gap-4">
      Seed Function
      <form
        action={async () => {
          "use server"

          const folderInsert = await db.insert(FolderSchema).values(
            mockFolders.map((folder, index) => ({
              id: index + 1,
              name: folder.name,
              parent: index !== 0 ? 1 : null,
            })),
          )

          const fileInsert = await db.insert(FileSchema).values(
            mockFiles.map((file, index) => ({
              id: index + 1,
              name: file.name,
              size: 50000,
              url: file.url,
              parent: (index % 3) + 1,
            })),
          )

          console.log(folderInsert)
          console.log(fileInsert)
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  )
}
