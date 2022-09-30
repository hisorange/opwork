import { PageHeader } from 'antd';
import React, { useState } from 'react';

export default function EditorPage() {
  const [serviceName, setServiceName] = useState('Service Name');
  const [serviceDescription, setServiceDescription] = useState(
    'Service Description',
  );

  return (
    <>
      <PageHeader title={serviceName} subTitle={serviceDescription} />
      <div>
        <code>Source Code?</code>
      </div>
    </>
  );
}
