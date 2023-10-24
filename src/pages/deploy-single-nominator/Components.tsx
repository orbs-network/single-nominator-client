import { Address } from "components";
import { ColumnFlex, Typography } from "styles";
import { useStore } from "./store";

import { StyledAddressDisplay } from "./styles";

export  const Addresses = () => {
  const { ownerAddress, validatorAddress, snAddress } = useStore();
  return (
    <ColumnFlex>
      {ownerAddress && <AddressDisplay label="Owner:" address={ownerAddress} />}
      {validatorAddress && (
        <AddressDisplay label="Validator:" address={validatorAddress} />
      )}
      {snAddress && (
        <AddressDisplay label="Single nominator:" address={snAddress} />
      )}
    </ColumnFlex>
  );
};


const AddressDisplay = ({
  label,
  address,
}: {
  label: string;
  address: string;
}) => {
  return (
    <StyledAddressDisplay>
      <Typography>{label}</Typography> <Address address={address} />
    </StyledAddressDisplay>
  );
};
