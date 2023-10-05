import { Address, Sender, toNano, beginCell } from "ton-core";
import { fromNano } from "ton";
import { getClientV2 } from "./client";

const WITHDRAW = 0x1000;
const MSG_VALUE = toNano(1.1);

export async function withdraw(
  sender: Sender,
  singleNominatorAddr: string,
  amount?: number
) {
  const client = await getClientV2();
  let _amount;
  if (!amount) {
    _amount = parseFloat(
      fromNano(await client.getBalance(Address.parse(singleNominatorAddr)))
    );
  } else {
    _amount = amount;
  }

  const payload = beginCell()
    .storeUint(WITHDRAW, 32)
    .storeUint(0, 64)
    .storeCoins(toNano(_amount.toFixed(2)))
    .endCell();

  await sender.send({
    to: Address.parse(singleNominatorAddr),
    value: MSG_VALUE,
    sendMode: 1 + 2,
    body: payload,
  });
  const newBalance = (
    await client.getBalance(Address.parse(singleNominatorAddr))
  ).toString();

  return newBalance;
}
