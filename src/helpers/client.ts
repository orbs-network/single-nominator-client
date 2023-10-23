import { TonClient } from "ton";
import {getHttpEndpoint} from "@orbs-network/ton-access";

export const getClientV2 = async () => {
  const endpoint = await getHttpEndpoint();
  return new TonClient({ endpoint });
};
