import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import PageLayout from '../layout/page.layout';

export default function RouterComponent() {
  return (
    <BrowserRouter basename="/admin">
      <Suspense fallback={<h1>Loading</h1>}>
        <PageLayout />
      </Suspense>
    </BrowserRouter>
  );
}
