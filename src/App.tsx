import { Navbar } from "components";
import { Layout } from "styles";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

function App() {
  return (
    <StyledApp>
      <Navbar />
      <Outlet />
    </StyledApp>
  );
}

export default App;

const StyledApp = styled(Layout)`
  padding-top: 80px;
`;
