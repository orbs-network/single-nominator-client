import React, { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { styled } from "styled-components";
export function Tooltip({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip: string;
}) {
  const [name] = useState(`id-${crypto.randomUUID()}`);
  return (
    <>
      <StyledA className={name}>{children}</StyledA>
      <ReactTooltip anchorSelect={`.${name}`} place="top">
        {tooltip}
      </ReactTooltip>
    </>
  );
}

const StyledA = styled.a`
   width: fit-content;
`