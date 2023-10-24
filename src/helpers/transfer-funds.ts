import { Address, Sender,toNano } from "ton-core";


export async function transferFunds(
  sender: Sender,
  singleNominatorAddr: string,
  amount: number,
) {
  await sender.send({
    to: Address.parse(singleNominatorAddr),
    value: BigInt(toNano(amount)),
    sendMode: 1 + 2,
  });
}
