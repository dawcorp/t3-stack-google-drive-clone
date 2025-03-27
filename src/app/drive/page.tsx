import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DrivePage() {
  const session = await auth()

  if (!session.userId) {
    return redirect("/sign-in")
  }

  return redirect(`/f/${1}`)
}
