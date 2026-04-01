import React from 'react'
import { useParams } from 'react-router-dom'

const JobDetails = () => {
    const {jobId} = useParams()
  return (
    <div>
      <h1>Job Details</h1>
      <h2>Job Id:{jobId}</h2>      
    </div>
  )
}

export default JobDetails
