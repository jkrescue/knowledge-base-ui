import React, { useEffect, useState } from 'react'
import { api } from '../api'

function ConnectionStatus() {
  const [status, setStatus] = useState('')
  const [backendHealthy, setBackendHealthy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await api.healthCheck()
        if (response && response.success) {
          setBackendHealthy(true)
          setStatus('后端服务可以正常连接')
        } else {
          throw new Error('后端服务无法连接')
        }
      } catch (err) {
        console.error('连接检查失败:', err)
        setBackendHealthy(false)
        setStatus('后端服务未连接')
        setError(err.message)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="alert">
      <p>{status}</p>
      {error && <p className="text-red-500">错误信息: {error}</p>}
    </div>
  )
}

export default ConnectionStatus
