import ProfilePage from "../page";
import { Params, SearchParams } from "@/types/global";

export default function FavoritePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return <ProfilePage params={params} searchParams={searchParams} />;
}
