import React from 'react'
import { Table } from 'antd'

function Component({ dataSource, columns, ...otherProps }) {
  return (
    <div>
      <Table
        tableLayout="auto"
        columns={columns}
        scroll={{ x: '80vw' }}
        dataSource={dataSource}
        {...otherProps}
      />
    </div>
  )
}

export default Component
