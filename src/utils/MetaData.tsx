import React from 'react'
import { Helmet } from 'react-helmet-async'

interface MyObject {
    title: string;
    // other properties...
  }

const MetaData = ({title}: MyObject) => {
  return (
    <div>
        <Helmet>
            <title>{title}</title>
        </Helmet>
    </div>
  )
}

export default MetaData