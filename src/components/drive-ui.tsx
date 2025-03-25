"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Progress } from "~/components/ui/progress";

export function DriveUI() {
  const [currentPath, setCurrentPath] = useState("root");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const currentData = mockData[currentPath as keyof typeof mockData] || [];

  const pathSegments = currentPath === "root" ? [] : currentPath.split("/");

  const handleFolderClick = (path: string) => {
    setCurrentPath(path);
  };

  const handleUpload = () => {
    setUploadOpen(true);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadOpen(false);
          }, 500);
        }
        return newProgress;
      });
    }, 300);
  };

  const navigateToPath = (index: number) => {
    if (index === -1) {
      setCurrentPath("root");
    } else {
      const newPath = pathSegments.slice(0, index + 1).join("/");
      setCurrentPath(newPath);
    }
  };

  return (
    <div className="bg-background flex h-screen">
      {/* Sidebar */}
      <div className="hidden w-64 border-r p-4 md:block">
        <div className="mb-6">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => handleUpload()}
          >
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

        <div className="mt-6 border-t pt-6">
          <div className="text-muted-foreground mb-2 text-xs">Storage</div>
          <Progress value={35} className="mb-2 h-2" />
          <div className="text-muted-foreground text-xs">
            3.5 GB of 15 GB used
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b p-4">
          <div className="flex flex-1 items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <MoreVertical className="h-5 w-5" />
            </Button>
            <div className="text-xl font-semibold">Drive</div>
            <div className="ml-4 max-w-md flex-1">
              <Input placeholder="Search in Drive" className="w-full" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid
                className={`h-5 w-5 ${viewMode === "grid" ? "text-primary" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List
                className={`h-5 w-5 ${viewMode === "list" ? "text-primary" : ""}`}
              />
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
        <div className="flex items-center gap-1 border-b p-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => navigateToPath(-1)}
          >
            My Drive
          </Button>

          {pathSegments.map((segment, index) => (
            <div key={index} className="flex items-center">
              <span className="text-muted-foreground mx-1">/</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 capitalize"
                onClick={() => navigateToPath(index)}
              >
                {segment}
              </Button>
            </div>
          ))}
        </div>

        {/* Mobile upload button */}
        <div className="p-4 md:hidden">
          <Button className="w-full gap-2" onClick={() => handleUpload()}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>

        {/* Files and folders */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === "list" ? (
            <div className="rounded-md border">
              <div className="bg-muted/50 grid grid-cols-12 border-b p-3 text-sm font-medium">
                <div className="col-span-6">Name</div>
                <div className="col-span-3">Last modified</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-1"></div>
              </div>

              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="hover:bg-muted/50 grid grid-cols-12 items-center border-b p-3 last:border-0"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    {item.type === "folder" ? (
                      <button
                        className="flex items-center gap-3 hover:underline"
                        onClick={() =>
                          handleFolderClick((item as { path: string }).path)
                        }
                      >
                        <Folder className="h-5 w-5 text-blue-500" />
                        <span>{item.name}</span>
                      </button>
                    ) : (
                      <Link
                        href="#"
                        className="flex items-center gap-3 hover:underline"
                      >
                        {item.name.endsWith(".jpg") ||
                        item.name.endsWith(".png") ? (
                          <ImageIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-gray-500" />
                        )}
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                  <div className="text-muted-foreground col-span-3 text-sm">
                    {item.type === "file" ? item.modified : "—"}
                  </div>
                  <div className="text-muted-foreground col-span-2 text-sm">
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
                        <DropdownMenuItem className="text-destructive">
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="hover:bg-muted/50 flex flex-col items-center rounded-md border p-4 text-center"
                >
                  {item.type === "folder" ? (
                    <button
                      className="flex w-full flex-col items-center gap-2"
                      onClick={() =>
                        handleFolderClick((item as { path: string }).path)
                      }
                    >
                      <Folder className="h-12 w-12 text-blue-500" />
                      <span className="w-full truncate text-sm">
                        {item.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href="#"
                      className="flex w-full flex-col items-center gap-2"
                    >
                      {item.name.endsWith(".jpg") ||
                      item.name.endsWith(".png") ? (
                        <ImageIcon className="h-12 w-12 text-green-500" />
                      ) : (
                        <FileText className="h-12 w-12 text-gray-500" />
                      )}
                      <span className="w-full truncate text-sm">
                        {item.name}
                      </span>
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
            <DialogDescription>
              Drag and drop files here or click to browse
            </DialogDescription>
          </DialogHeader>

          <div className="hover:bg-muted/50 cursor-pointer rounded-lg border-2 border-dashed p-10 text-center">
            <Upload className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
            <p className="text-muted-foreground text-sm">
              Drop your files here or click to browse
            </p>
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm">
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
  );
}
