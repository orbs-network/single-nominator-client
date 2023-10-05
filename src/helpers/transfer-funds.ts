import { Address, Sender, beginCell } from "ton-core";

const TRANSFER_WITH_COMMENT = 0x0;

// TODO: add comment
// amount should be in Nano
export async function transferFunds(
  sender: Sender,
  singleNominatorAddr: string,
  amount: number,
  comment?: string
) {
  const payload = beginCell().storeUint(TRANSFER_WITH_COMMENT, 32).endCell();
  await sender.send({
    to: Address.parse(singleNominatorAddr),
    value: BigInt(amount),
    sendMode: 1 + 2,
    body: payload,
  });
}
