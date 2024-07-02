
//   createDirectus(PUBLIC_DIRECTUS_API_URL)
//     .with(authentication("json"))
//     .with(rest());
import { authentication, createDirectus, rest } from "@directus/sdk";

export const PUBLIC_DIRECTUS_API_URL = import.meta.env
  .VITE_PUBLIC_DIRECTUS_API_URL;

function getDirectusInstance() {
  const directus = createDirectus(PUBLIC_DIRECTUS_API_URL)
    .with(
      authentication("cookie", { credentials: "include", autoRefresh: true })
    )
    .with(rest({ credentials: "include" }));
  return directus;
}
export default getDirectusInstance;