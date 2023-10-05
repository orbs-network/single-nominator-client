import { TonClient } from "ton";
import tonAccess from "@orbs-network/ton-access";
export const getClientV2 = async () => {
  const endpoint = await tonAccess.getHttpEndpoint();
  return new TonClient({ endpoint });
};
