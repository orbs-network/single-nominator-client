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

  let _amount;

  const balance = await client.getBalance(Address.parse(singleNominatorAddr));
  if (!amount) {
    _amount = parseFloat(fromNano(balance));
  } else {
    _amount = amount;
  }

  if (Number(_amount) > parseFloat(fromNano(balance))) {
    throw new Error(
      `Sanity test cannot be completed because single nominator balance (${parseFloat(
        fromNano(balance)
      ).toFixed(2)} TON) is less than ${_amount} TON`
    );
  }

  const payload = beginCell()
    .storeUint(WITHDRAW, 32)
    .storeUint(0, 64)
    .storeCoins(toNano(_amount.toFixed(2)))
    .endCell();

  const oldBalance = (
    await client.getBalance(Address.parse(singleNominatorAddr))
  ).toString();
  console.log(singleNominatorAddr, amount, client, "sending withdraw");

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
