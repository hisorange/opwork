import { EditOutlined, FileOutlined } from '@ant-design/icons';
import { Button, List, PageHeader } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IWorker } from '../../server/types/worker.interface';

export default function IndexPage() {
  const [services, setServices] = useState<IWorker[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  return (
    <>
      <PageHeader
        title="Workers"
        extra={[
          <Button
            disabled
            key="create"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`editor/${crypto.randomUUID()}`)}
          >
            New Worker
          </Button>,
        ]}
      />
      <div className="px-4">
        <List bordered size="large">
          {services.map(service => (
            <List.Item
              key={service.name}
              extra={[
                <Link key="edit" to={`editor/${service.name}`}>
                  <Button size="small" icon={<EditOutlined />}>
                    Edit
                  </Button>
                </Link>,
              ]}
            >
              <List.Item.Meta
                avatar={<FileOutlined />}
                title={service.name}
              ></List.Item.Meta>
            </List.Item>
          ))}
        </List>
      </div>
    </>
  );
}
