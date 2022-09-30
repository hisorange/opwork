import { Divider, Typography } from 'antd';
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
      <Typography.Title>Services</Typography.Title>
      <Divider />

      <ul>
        {services.map(service => (
          <li key={service.name}>
            <a href={`/service/${service.name}`}>{service.name}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
