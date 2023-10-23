import { Address, Sender, beginCell, toNano } from "ton-core";

const TRANSFER_WITH_COMMENT = 0;

export async function transferFunds(
  sender: Sender,
  singleNominatorAddr: string,
  amount: number,
  comment?: string
) {
  await sender.send({
    to: Address.parse(singleNominatorAddr),
    value: BigInt(toNano(amount)),
    sendMode: 1 + 2,
  });
}
