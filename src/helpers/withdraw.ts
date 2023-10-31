/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address, Sender, toNano, beginCell } from "ton-core";
import { fromNano } from "ton";
import { getClientV2 } from "./client";
import { waitForConditionChange } from "./util";

const WITHDRAW = 0x1000;
const MSG_VALUE = toNano(0.1);

export async function withdraw(
  sender: Sender,
  singleNominatorAddr: string,
  amount?: number
) {
  const client = await getClientV2();
  console.log(singleNominatorAddr, amount, client);

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

  const oldBalance = (
    await client.getBalance(Address.parse(singleNominatorAddr))
  ).toString();

  await sender.send({
    to: Address.parse(singleNominatorAddr),
    value: MSG_VALUE,
    sendMode: 1 + 2,
    body: payload,
  });

  return await waitForConditionChange(
    () => client.getBalance(Address.parse(singleNominatorAddr)),
    BigInt(oldBalance)
  );
}
