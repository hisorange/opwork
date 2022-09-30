import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexPage from '../pages/index.page';

export default function PageLayout() {
  return (
    <Layout className="w-screen min-h-screen bg-white" hasSider>
      <Content className="text-gray-800 min-h-screen">
        <Layout.Header>
          <h1 className="text-white">OpWork</h1>
        </Layout.Header>

        <div className="px-4 py-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route index element={<IndexPage />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
}
