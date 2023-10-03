import { Address, Sender, toNano, beginCell, Cell } from "ton-core";
import { SendMode, TonClient, fromNano } from "ton";

const WITHDRAW = 0x1000;
const MSG_VALUE = toNano(1.1);

export async function withdraw(sender: Sender, client: TonClient, singleNominatorAddr: string) {

    const balance = parseFloat(fromNano((await client.getBalance(Address.parse(singleNominatorAddr)))));
    const payload = beginCell().storeUint(WITHDRAW, 32).storeUint(0, 64).storeCoins(toNano(balance.toFixed(2))).endCell();

    await sender.send({to: Address.parse(singleNominatorAddr), value: MSG_VALUE, sendMode: 1+2, body: payload})
    const newBalance = (await client.getBalance(Address.parse(singleNominatorAddr))).toString();

    return newBalance;
}

