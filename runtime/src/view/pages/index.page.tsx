import {
  EditOutlined,
  FileAddOutlined,
  FileOutlined,
  PlayCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, List, message, PageHeader } from 'antd';
import axios from 'axios';
import useAxios from 'axios-hooks';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IWorker } from '../../server/types/worker.interface';

export default function IndexPage() {
  const [workers, setWorkers] = useState<IWorker[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [{ data, loading, error }, refetch] =
    useAxios<IWorker[]>(`/api/workers`);
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Workers"
        subTitle="List of installed workers"
        avatar={{
          icon: <UnorderedListOutlined />,
          size: 'large',
          shape: 'square',
        }}
        extra={[
          <Button
            key="create"
            type="primary"
            loading={isCreating}
            disabled={isCreating}
            icon={<FileAddOutlined />}
            onClick={async () => {
              const reply = await axios.post('/api/workers');
              message.success('Worker created');
              navigate(`editor/${reply.data.id}`);
            }}
          >
            Create Worker
          </Button>,
        ]}
      />
      <div className="px-4">
        <List
          bordered
          size="large"
          loading={loading}
          dataSource={data}
          renderItem={worker => (
            <List.Item
              className="hover:bg-gray-200 duration-100 ease-out transition-colors"
              key={worker.id}
              extra={[
                <a key="visit" href={`/worker/${worker.path}`} target="_blank">
                  <Button
                    size="small"
                    icon={<PlayCircleOutlined />}
                    className="mr-1"
                    type="primary"
                  >
                    Run
                  </Button>
                </a>,
                <Link key="edit" to={`editor/${worker.id}`}>
                  <Button size="small" icon={<EditOutlined />}>
                    Edit
                  </Button>
                </Link>,
              ]}
            >
              <List.Item.Meta
                avatar={<FileOutlined />}
                title={worker.name}
              ></List.Item.Meta>
            </List.Item>
          )}
        ></List>
      </div>
    </>
  );
}
