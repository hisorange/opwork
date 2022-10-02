import {
  CodeOutlined,
  PlayCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Button, Divider, message, notification, PageHeader, Tabs } from 'antd';
import Input from 'antd/lib/input/Input';
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
  const [deployPath, setDeployPath] = useState('');
  const [isCodeChanged, setIsCodeChanged] = useState(false);

  const [selectedTab, setSelectedTab] = useState('code');

  useEffect(() => {
    if (data) {
      setWorkerPath(data.path);
      setWorkerName(data.name);
      setSourceCode(data.code);

      setDeployPath(
        `${globalThis.location.protocol}//${globalThis.location.hostname}${
          globalThis.location.port != '80' ? `:${globalThis.location.port}` : ''
        }/worker/${data.path}`,
      );
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PageHeader
        onBack={() => navigate('/')}
        avatar={{
          icon: <CodeOutlined />,
          size: 'large',
          shape: 'square',
        }}
        title="Worker Editor"
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
            disabled={isCodeChanged}
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
        <Tabs>
          <Tabs.TabPane tab="Source Code" key="code">
            <CodeEditor
              value={sourceCode}
              language="js"
              placeholder="Please enter Javascript worker code."
              onChange={e => {
                setSourceCode(e.target.value);
                setIsCodeChanged(true);
              }}
              padding={16}
              style={{
                fontSize: 12,
                minHeight: 400,
                backgroundColor: '#282a36',
                fontFamily:
                  'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Details" key="details">
            <div className="max-w-xl">
              <h2>ID</h2>
              <code>{id}</code>
              <Divider />

              <h2>Name</h2>
              <Input
                value={workerName}
                onChange={e => {
                  setWorkerName(e.target.value);
                  setIsCodeChanged(true);
                }}
                size="large"
                className="text-4xl"
              />
              <Divider />

              <h2>
                Path{' '}
                <small className="text-gray-400 text-sm italic font-thin">
                  {deployPath}
                </small>
              </h2>

              <Input
                size="large"
                className="text-4xl"
                value={workerPath}
                onChange={e => {
                  setWorkerPath(e.target.value);
                  setIsCodeChanged(true);
                }}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}
