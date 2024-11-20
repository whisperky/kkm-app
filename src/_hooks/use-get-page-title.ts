import { usePathname } from "next/navigation";
import { routes } from "../_constants/routes";

export default function useGetPageTitle(): [title: string, path: string] {
  const params = usePathname();

  const currentRoute = routes
    ?.filter((route) => params.startsWith(route.path))
    ?.sort((a, b) => b.path?.length - a?.path?.length)[0];

  const title = currentRoute?.title;
  const path = currentRoute?.path;

  return [title, path];
}
