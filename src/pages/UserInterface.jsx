import React from 'react'
import { Settings } from './Settings'
import { QuickTips } from './QuickTips'

function UserInterface() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Settings />
      <QuickTips />
    </div>
  )
}

export default UserInterface
