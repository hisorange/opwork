import {
  FileOutlined,
  PlayCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Layout, message, notification, PageHeader } from 'antd';
import Input from 'antd/lib/input/Input';
import TextArea from 'antd/lib/input/TextArea';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import axios from 'axios';
import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IWorker } from '../../server/types/worker.interface';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [{ data, loading, error }, refetch] = useAxios<IWorker>(
    `/api/workers/${id}`,
  );

  const [workerName, setWorkerName] = useState('My Worker');
  const [workerPath, setWorkerPath] = useState(id);
  const [sourceCode, setSourceCode] = useState('Hello, World');
  const [isCodeChanged, setIsCodeChanged] = useState(false);

  useEffect(() => {
    if (data) {
      setWorkerPath(data.path);
      setWorkerName(data.name);
      setSourceCode(data.code);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout hasSider>
      <Sider
        className="min-h-screen !bg-gray-600 text-white px-2"
        theme="light"
      >
        <h2 className="text-white">ID</h2>

        {id}

        <h2 className="text-white">Path</h2>

        <Input
          className="mb-4"
          value={workerPath}
          onChange={e => setWorkerPath(e.target.value)}
        />
      </Sider>

      <Content>
        <PageHeader
          onBack={() => navigate('/')}
          avatar={{
            icon: <FileOutlined />,
            size: 'large',
            shape: 'square',
          }}
          title={
            <Input
              value={workerName}
              onChange={e => setWorkerName(e.target.value)}
              bordered={false}
              size="large"
              className="text-4xl"
            />
          }
          subTitle={`Available at ${globalThis.location.protocol}//${
            globalThis.location.hostname
          }${
            globalThis.location.port != '80'
              ? `:${globalThis.location.port}`
              : ''
          }/worker/${workerPath}`}
          extra={[
            <Button
              key="save"
              type={isCodeChanged ? 'primary' : 'ghost'}
              icon={<SaveOutlined />}
              onClick={async () => {
                await axios.patch(`/api/workers/${id}`, {
                  name: workerName,
                  path: workerPath,
                  code: sourceCode,
                });

                setIsCodeChanged(false);

                message.success('Service updated');
                refetch();
              }}
            >
              Save
            </Button>,
            <Button
              key="run"
              type="dashed"
              icon={<PlayCircleOutlined />}
              onClick={async () => {
                const reply = await axios.get(`/worker/${workerPath}`);

                notification.info({
                  message: 'Service executed:',
                  description: JSON.stringify(reply.data),
                  duration: 3,
                  placement: 'bottomRight',
                });
              }}
            >
              Run
            </Button>,
          ]}
        />
        <div className="px-4">
          <TextArea
            rows={20}
            className="w-full"
            value={sourceCode}
            onChange={e => {
              setSourceCode(e.target.value);
              setIsCodeChanged(true);
            }}
          />
        </div>
      </Content>
    </Layout>
  );
}
