import {
  FileOutlined,
  PlayCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, message, notification, PageHeader } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
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
    <>
      <PageHeader
        onBack={() => navigate('/')}
        avatar={{
          icon: <FileOutlined />,
          size: 'large',
          shape: 'square',
        }}
        title={workerName}
        subTitle={`Available at ${globalThis.location.protocol}//${
          globalThis.location.hostname
        }${
          globalThis.location.port != '80' ? `:${globalThis.location.port}` : ''
        }/worker/${workerPath}`}
        extra={[
          <Button
            key="save"
            type={isCodeChanged ? 'primary' : 'ghost'}
            icon={<SaveOutlined />}
            onClick={async () => {
              await axios.patch(`/api/workers/${id}`, {
                name: workerName,
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
    </>
  );
}
