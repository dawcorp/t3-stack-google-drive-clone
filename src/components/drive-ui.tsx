"use client"

import { useState } from "react"
import Link from "next/link"
import {
  FileText,
  Folder,
  Home,
  ImageIcon,
  Info,
  LayoutGrid,
  List,
  MoreVertical,
  Plus,
  Share2,
  Star,
  Trash,
  Upload,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Progress } from "~/components/ui/progress"

// Mock data for files and folders
const mockData = {
  root: [
    { id: "folder1", name: "Documents", type: "folder", path: "documents" },
    { id: "folder2", name: "Images", type: "folder", path: "images" },
    { id: "folder3", name: "Projects", type: "folder", path: "projects" },
    { id: "file1", name: "Resume.pdf", type: "file", size: "2.4 MB", modified: "Apr 12, 2023" },
    { id: "file2", name: "Budget.xlsx", type: "file", size: "1.8 MB", modified: "May 5, 2023" },
  ],
  documents: [
    { id: "doc1", name: "Report.docx", type: "file", size: "3.2 MB", modified: "Jun 15, 2023" },
    { id: "doc2", name: "Contract.pdf", type: "file", size: "4.5 MB", modified: "Jul 2, 2023" },
    { id: "doc3", name: "Notes.txt", type: "file", size: "0.1 MB", modified: "Aug 10, 2023" },
  ],
  images: [
    { id: "img1", name: "Vacation.jpg", type: "file", size: "5.6 MB", modified: "Sep 3, 2023" },
    { id: "img2", name: "Family.png", type: "file", size: "8.2 MB", modified: "Oct 12, 2023" },
    { id: "img3", name: "Screenshot.png", type: "file", size: "1.3 MB", modified: "Nov 5, 2023" },
  ],
  projects: [
    { id: "proj1", name: "Website", type: "folder", path: "projects/website" },
    { id: "proj2", name: "App", type: "folder", path: "projects/app" },
    { id: "proj3", name: "Presentation.pptx", type: "file", size: "7.8 MB", modified: "Dec 1, 2023" },
  ],
  "projects/website": [
    { id: "web1", name: "index.html", type: "file", size: "0.2 MB", modified: "Jan 5, 2024" },
    { id: "web2", name: "styles.css", type: "file", size: "0.1 MB", modified: "Jan 6, 2024" },
    { id: "web3", name: "script.js", type: "file", size: "0.3 MB", modified: "Jan 7, 2024" },
  ],
  "projects/app": [
    { id: "app1", name: "main.js", type: "file", size: "0.5 MB", modified: "Feb 10, 2024" },
    { id: "app2", name: "config.json", type: "file", size: "0.1 MB", modified: "Feb 11, 2024" },
    { id: "app3", name: "README.md", type: "file", size: "0.2 MB", modified: "Feb 12, 2024" },
  ],
}

export function DriveUI() {
  const [currentPath, setCurrentPath] = useState("root")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const currentData = mockData[currentPath as keyof typeof mockData] || []

  const pathSegments = currentPath === "root" ? [] : currentPath.split("/")

  const handleFolderClick = (path: string) => {
    setCurrentPath(path)
  }

  const handleUpload = () => {
    setUploadOpen(true)
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsUploading(false)
            setUploadOpen(false)
          }, 500)
        }
        return newProgress
      })
    }, 300)
  }

  const navigateToPath = (index: number) => {
    if (index === -1) {
      setCurrentPath("root")
    } else {
      const newPath = pathSegments.slice(0, index + 1).join("/")
      setCurrentPath(newPath)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r p-4 hidden md:block">
        <div className="mb-6">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleUpload()}>
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>

        <nav className="space-y-1">
          <Button
            variant={currentPath === "root" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setCurrentPath("root")}
          >
            <Home className="h-4 w-4" />
            My Drive
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Share2 className="h-4 w-4" />
            Shared with me
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Star className="h-4 w-4" />
            Starred
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Trash className="h-4 w-4" />
            Trash
          </Button>
        </nav>

        <div className="mt-6 pt-6 border-t">
          <div className="text-xs text-muted-foreground mb-2">Storage</div>
          <Progress value={35} className="h-2 mb-2" />
          <div className="text-xs text-muted-foreground">3.5 GB of 15 GB used</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Button variant="ghost" size="icon" className="md:hidden">
              <MoreVertical className="h-5 w-5" />
            </Button>
            <div className="text-xl font-semibold">Drive</div>
            <div className="flex-1 max-w-md ml-4">
              <Input placeholder="Search in Drive" className="w-full" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setViewMode("grid")}>
              <LayoutGrid className={`h-5 w-5 ${viewMode === "grid" ? "text-primary" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setViewMode("list")}>
              <List className={`h-5 w-5 ${viewMode === "list" ? "text-primary" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="p-4 border-b flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8" onClick={() => navigateToPath(-1)}>
            My Drive
          </Button>

          {pathSegments.map((segment, index) => (
            <div key={index} className="flex items-center">
              <span className="mx-1 text-muted-foreground">/</span>
              <Button variant="ghost" size="sm" className="h-8 capitalize" onClick={() => navigateToPath(index)}>
                {segment}
              </Button>
            </div>
          ))}
        </div>

        {/* Mobile upload button */}
        <div className="md:hidden p-4">
          <Button className="w-full gap-2" onClick={() => handleUpload()}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>

        {/* Files and folders */}
        <div className="flex-1 p-4 overflow-auto">
          {viewMode === "list" ? (
            <div className="border rounded-md">
              <div className="grid grid-cols-12 p-3 border-b bg-muted/50 text-sm font-medium">
                <div className="col-span-6">Name</div>
                <div className="col-span-3">Last modified</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-1"></div>
              </div>

              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 p-3 border-b last:border-0 items-center hover:bg-muted/50"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    {item.type === "folder" ? (
                      <button
                        className="flex items-center gap-3 hover:underline"
                        onClick={() => handleFolderClick(item.path)}
                      >
                        <Folder className="h-5 w-5 text-blue-500" />
                        <span>{item.name}</span>
                      </button>
                    ) : (
                      <Link href="#" className="flex items-center gap-3 hover:underline">
                        {item.name.endsWith(".jpg") || item.name.endsWith(".png") ? (
                          <ImageIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-gray-500" />
                        )}
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                  <div className="col-span-3 text-sm text-muted-foreground">
                    {item.type === "file" ? item.modified : "—"}
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {item.type === "file" ? item.size : "—"}
                  </div>
                  <div className="col-span-1 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-md p-4 hover:bg-muted/50 flex flex-col items-center text-center"
                >
                  {item.type === "folder" ? (
                    <button
                      className="flex flex-col items-center gap-2 w-full"
                      onClick={() => handleFolderClick(item.path)}
                    >
                      <Folder className="h-12 w-12 text-blue-500" />
                      <span className="text-sm truncate w-full">{item.name}</span>
                    </button>
                  ) : (
                    <Link href="#" className="flex flex-col items-center gap-2 w-full">
                      {item.name.endsWith(".jpg") || item.name.endsWith(".png") ? (
                        <ImageIcon className="h-12 w-12 text-green-500" />
                      ) : (
                        <FileText className="h-12 w-12 text-gray-500" />
                      )}
                      <span className="text-sm truncate w-full">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload files</DialogTitle>
            <DialogDescription>Drag and drop files here or click to browse</DialogDescription>
          </DialogHeader>

          <div className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50">
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drop your files here or click to browse</p>
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={simulateUpload} disabled={isUploading}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

