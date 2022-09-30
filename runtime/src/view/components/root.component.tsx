import React from 'react';
import { RecoilRoot } from 'recoil';
import '../styles/main.less';
import RouterComponent from './router.component';

export default function RootComponent() {
  return (
    <RecoilRoot>
      <RouterComponent />
    </RecoilRoot>
  );
}
