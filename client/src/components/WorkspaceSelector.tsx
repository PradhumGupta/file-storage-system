import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Membership } from "@/contexts/WorkspaceContext";
import { useNavigate, useParams } from "react-router-dom";
import { slugify } from "@/utils/slugify";
import WorkspaceServices from "@/services/workspace.api";
import toast from "react-hot-toast";
import { useWorkspace } from "@/hooks/useWorkspace";

function WorkspaceSelector() {
  const [open, setOpen] = React.useState(false);
  const [memberships, setMemberships] = React.useState<Membership[]>([]);

  const { workspaceName } = useParams();

  const [value, setValue] = React.useState(workspaceName || "personal");
  const navigate = useNavigate();
  const { setWorkspace, setLoading, setRole } = useWorkspace();

  const frameworks = memberships.map((m) => ({
    label: m.workspace.name,
    value:
      m.workspace.type === "PERSONAL" ? "personal" : slugify(m.workspace.name),
  }));

  React.useEffect(() => {
    // Only attempt to fetch data if we are not already on the correct workspace
    // if (workspaceName && slugify(activeWorkspace?.name) === workspaceName) {
    //   return;
    // }

    const fetchWorkspace = async () => {
      if (!workspaceName) {
        navigate("/dashboard/personal");
        return;
      }

      setLoading(true);

      try {
        const memberships: Membership[] = await WorkspaceServices.fetchWorkspaces();
        setMemberships(memberships);
        const found = memberships.find(
          (m) =>
            slugify(m.workspace.name) === workspaceName ||
            m.workspace.type === workspaceName.toUpperCase()
        );

        if (found) {
          const res = await WorkspaceServices.fetchData(found.workspace.id);
          setWorkspace(res.workspace);
          setRole(found.role);
        } else {
          // Handle case where workspace is not found, e.g., redirect or show error
          toast.error("Workspace not found");
          // Optionally, navigate to a default or error page
          navigate('/dashboard');
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceName]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Search workspace..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search workspace..." className="h-9" />
          <CommandList>
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    navigate(`/dashboard/${currentValue}`);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default WorkspaceSelector;
