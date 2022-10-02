import { EditOutlined, EyeOutlined, FileOutlined } from '@ant-design/icons';
import { Button, List, message, PageHeader } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IWorker } from '../../server/types/worker.interface';

export default function IndexPage() {
  const [workers, setWorkers] = useState<IWorker[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/workers')
      .then(res => res.json())
      .then(data => setWorkers(data));
  }, []);

  return (
    <>
      <PageHeader
        title="Workers"
        extra={[
          <Button
            key="create"
            type="primary"
            loading={isCreating}
            disabled={isCreating}
            icon={<EditOutlined />}
            onClick={async () => {
              const reply = await axios.post('/api/workers');
              message.success('Worker created');
              navigate(`editor/${reply.data.id}`);
            }}
          >
            New Worker
          </Button>,
        ]}
      />
      <div className="px-4">
        <List bordered size="large">
          {workers.map(worker => (
            <List.Item
              key={worker.name}
              extra={[
                <a key="visit" href={`/worker/${worker.path}`} target="_blank">
                  <Button size="small" icon={<EyeOutlined />} className="mr-1">
                    Open
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
          ))}
        </List>
      </div>
    </>
  );
}
