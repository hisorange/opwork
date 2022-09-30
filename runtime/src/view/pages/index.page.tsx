import { List, PageHeader } from 'antd';
import React, { useEffect, useState } from 'react';
import { IWorker } from '../../server/types/worker.interface';

export default function IndexPage() {
  const [services, setServices] = useState<IWorker[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  return (
    <>
      <PageHeader title="Services" />
      <List>
        {services.map(service => (
          <List.Item key={service.name}>
            <a className="text-lg indent-5" href={`/service/${service.name}`}>
              - {service.name}
            </a>
          </List.Item>
        ))}
      </List>
    </>
  );
}
