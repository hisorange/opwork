import { EditOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import EditorPage from '../pages/editor.page';
import IndexPage from '../pages/index.page';

export default function PageLayout() {
  return (
    <Layout className="w-screen min-h-screen" hasSider>
      <Sider className="h-screen" collapsed collapsedWidth={48}>
        <Menu theme="dark">
          <Menu.Item key="0">
            <Link to="/">OP</Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <EditOutlined />
          </Menu.Item>
        </Menu>
      </Sider>

      <Content
        className="text-gray-800"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        <Routes>
          <Route index element={<IndexPage />} />
          <Route path="editor" element={<EditorPage />} />
        </Routes>
      </Content>
    </Layout>
  );
}
