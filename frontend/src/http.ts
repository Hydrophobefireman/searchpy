import type {} from "statedrive";

import { buildHttpClient } from "@kit/http";
export const { client, requests, useAuthState, useIsLoggedIn } =
  buildHttpClient({});
