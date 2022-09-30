import { HomeOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import logo from '../images/logo/colour.svg';
import EditorPage from '../pages/editor.page';
import IndexPage from '../pages/index.page';

export default function PageLayout() {
  return (
    <Layout className="w-screen min-h-screen" hasSider>
      <Sider className="h-screen !bg-midnight" collapsed collapsedWidth={48}>
        <div className="text-center py-1 bg-gray-700 duration-300 ease-blink hover:bg-primary">
          <a href="/admin">
            <img src={logo} alt="logo" className="w-8 h-8" />
          </a>
        </div>

        <Menu
          theme="dark"
          defaultActiveFirst
          defaultSelectedKeys={['1']}
          className="bg-midnight"
        >
          <Menu.Item key="1">
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Content
        className="text-gray-800"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        <Routes>
          <Route index element={<IndexPage />} />
          <Route path="editor/:id" element={<EditorPage />} />
        </Routes>
      </Content>
    </Layout>
  );
}
