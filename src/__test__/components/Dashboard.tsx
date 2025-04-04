import React from 'react';
import { reduxConnector } from '../redux';
import { ConnectedProps } from 'react-redux';

function Dashboard({ isCollapse, setCollapse }: ConnectedProps<typeof connect>) {
  return (
    <>
      <div>Dashboard {isCollapse}</div>
      <button onClick={() => setCollapse(true)}>Set Collapse</button>
    </>
  );
}

const connect = reduxConnector(
  (s) => ({
    isCollapse: s.getCollapse,
  }),
  (a) => ({
    setCollapse: a.setCollapse,
  }),
);

export default connect(Dashboard);
