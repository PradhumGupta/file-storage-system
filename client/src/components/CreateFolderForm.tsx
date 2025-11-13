import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import FileServices from "@/services/files.api";
import toast from "react-hot-toast";
import type { Folder } from "@/contexts/WorkspaceContext";
import { useWorkspace } from "@/hooks/useWorkspace";

interface props {
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
}

export default function CreateFolderForm({
  openForm,
  setOpenForm,
  setFolders,
}: props) {
  const { activeWorkspace, activeFolder } = useWorkspace();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (!name.trim()) {
      toast.error("Folder name is required");
      return;
    }
    try {
      const folder = await FileServices.createFolder(
        activeWorkspace!.id,
        name,
        activeFolder?.id
      );
      setFolders((prev: Folder[]) => [...prev, folder]);
      setOpenForm(false);
      toast.success("Folder created!");
    } catch (error) {
      if(error instanceof Error)  toast.error(error.message)
    }
  };

  return (
    <Dialog open={openForm} onOpenChange={setOpenForm}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogDescription>
              folder will be created in {activeFolder?.name || "workspace"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input id="name" name="name" placeholder="Enter folder name" />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
