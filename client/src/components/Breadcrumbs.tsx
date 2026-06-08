import { Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface PROPS {
  path: {
  id: string;
  name: string;
  }[]
}

const Breadcrumbs = ({path}: PROPS) => {
  const { workspaceName } = useParams();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to={`/dashboard/${workspaceName}`} className="cursor-pointer">
            <Home className="h-4 w-4" />
          </Link>
        </BreadcrumbItem>
        {path.map((item, index) => (
          <div key={item.id} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === path.length - 1 ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={`/${item.id}`} className="cursor-pointer">
                  {item.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
