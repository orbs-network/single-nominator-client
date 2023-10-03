import { Address, Sender, toNano, beginCell, Cell } from "ton-core";
import { SendMode, TonClient, fromNano } from "ton";

const MSG_VALUE = toNano(1.1);
const CHANGE_VALIDATOR_ADDRESS = 0x1001;

export async function changeValidator(sender: Sender, singleNominatorAddr: string, newValidatorAddr: string) {

    const payload = beginCell().storeUint(CHANGE_VALIDATOR_ADDRESS, 32)
    .storeUint(1, 64).storeAddress(Address.parse(newValidatorAddr)).endCell();

    await sender.send({to: Address.parse(singleNominatorAddr), value: MSG_VALUE, sendMode: 1+2, body: payload})
}

export async function roles(sender: Sender, client: TonClient, singleNominatorAddr: string, newValidatorAddr: string) {
    return await client.runMethod(Address.parse(singleNominatorAddr), 'get_roles');
}
