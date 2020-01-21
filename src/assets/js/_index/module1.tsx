import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  width: 100px;
  height: 100px;
  background-color: #ff0000;
`;

export default (props)=> {
  let test: string = 'test';
  console.log(test);
  return (
    <StyledDiv className="test">
      React module
    </StyledDiv>
  )
}