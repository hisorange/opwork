import {
  AppstoreAddOutlined,
  BarChartOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import logo from '../images/logo/colour.svg';
import AnalyticsPage from '../pages/analytics.page';
import CloudPage from '../pages/cloud.page';
import EditorPage from '../pages/editor.page';
import IndexPage from '../pages/index.page';

export default function PageLayout() {
  return (
    <Layout className="w-screen min-h-screen" hasSider>
      <Sider className="h-screen !bg-midnight" collapsed collapsedWidth={48}>
        <div className="text-center py-1 duration-300 ease-blink hover:bg-orange-500">
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
          <Menu.Item key="1" title="Workers">
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item key="2" title="Analytics">
            <Link to="/analytics">
              <BarChartOutlined />
            </Link>
          </Menu.Item>
          <Menu.Item key="3" title="Cloud Store">
            <Link to="/cloud-store">
              <AppstoreAddOutlined />
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout
        className="text-gray-800 !bg-white"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        <Routes>
          <Route index element={<IndexPage />} />
          <Route path="editor/:id" element={<EditorPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="cloud-store" element={<CloudPage />} />
        </Routes>
      </Layout>
    </Layout>
  );
}
