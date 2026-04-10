import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react'

// 模拟知识图谱数据
const graphData = {
  nodes: [
    { id: 'home', name: 'Home', type: 'system', group: 0 },
    { id: 'daily-1', name: '2026-04-10', type: 'daily', group: 1 },
    { id: 'daily-2', name: '2026-04-11', type: 'daily', group: 1 },
    { id: 'daily-3', name: '2026-04-12', type: 'daily', group: 1 },
    { id: 'project-1', name: 'LLM Wiki', type: 'projects', group: 2 },
    { id: 'project-2', name: 'Voice Assistant', type: 'projects', group: 2 },
    { id: 'ai-1', name: 'AI Research', type: 'ai', group: 3 },
    { id: 'concept-1', name: 'Knowledge Base', type: 'concepts', group: 4 },
    { id: 'life-1', name: 'Health', type: 'life', group: 5 },
    { id: 'meeting-1', name: 'Weekly Sync', type: 'meetings', group: 6 },
  ],
  links: [
    { source: 'home', target: 'daily-1' },
    { source: 'home', target: 'daily-2' },
    { source: 'home', target: 'daily-3' },
    { source: 'daily-1', target: 'project-1' },
    { source: 'daily-2', target: 'project-1' },
    { source: 'daily-3', target: 'project-2' },
    { source: 'project-1', target: 'ai-1' },
    { source: 'project-1', target: 'concept-1' },
    { source: 'daily-3', target: 'life-1' },
    { source: 'daily-1', target: 'meeting-1' },
    { source: 'ai-1', target: 'concept-1' },
  ]
}

const colorMap = {
  system: '#f5f5f5',
  daily: '#e1f5fe',
  weekly: '#e8f5e9',
  ai: '#fff3e0',
  projects: '#fce4ec',
  concepts: '#e0f2f1',
  meetings: '#fef9c3',
  life: '#e8eaf6',
}

const typeLabels = {
  system: 'System',
  daily: 'Daily',
  weekly: 'Weekly',
  ai: 'AI Research',
  projects: 'Projects',
  concepts: 'Concepts',
  meetings: 'Meetings',
  life: 'Life',
}

function KnowledgeGraph() {
  const svgRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!svgRef.current) return

    const width = svgRef.current.clientWidth
    const height = 600

    // 清除之前的内容
    d3.select(svgRef.current).selectAll('*').remove()

    // 创建 SVG
    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])

    // 创建缩放行为
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
        setZoom(event.transform.k)
      })

    svg.call(zoomBehavior)

    // 创建主容器
    const g = svg.append('g')

    // 创建力导向图模拟
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))

    // 绘制连线
    const link = g.append('g')
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5)

    // 绘制节点
    const node = g.append('g')
      .selectAll('g')
      .data(graphData.nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }))

    // 节点圆形
    node.append('circle')
      .attr('r', d => d.type === 'system' ? 20 : d.type === 'daily' ? 12 : 18)
      .attr('fill', d => colorMap[d.type] || '#90caf9')
      .attr('stroke', d => d.type === 'system' ? '#666' : '#333')
      .attr('stroke-width', d => d.type === 'system' ? 2 : 1.5)

    // 节点标签
    node.append('text')
      .text(d => d.name)
      .attr('x', d => d.type === 'daily' ? 18 : 24)
      .attr('y', 4)
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .attr('pointer-events', 'none')

    // 点击事件
    node.on('click', (event, d) => {
      setSelectedNode(d)
    })

    // 更新位置
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [])

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(svg.zoom().scaleBy, 1.3)
  }

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(svg.zoom().scaleBy, 0.7)
  }

  const handleReset = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(svg.zoom().transform, d3.zoomIdentity)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">知识图谱</h2>
          <p className="text-gray-500 mt-1">可视化笔记关系网络</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <span>力导向图</span>
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <span>环形图</span>
          </button>
        </div>
      </div>

      {/* Graph Container */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Graph */}
        <div className="flex-1 card relative overflow-hidden">
          <svg 
            ref={svgRef} 
            className="w-full h-full"
            style={{ minHeight: '500px' }}
          />
          
          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button 
              onClick={handleZoomIn}
              className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ZoomIn size={20} />
            </button>
            <button 
              onClick={handleZoomOut}
              className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ZoomOut size={20} />
            </button>
            <button 
              onClick={handleReset}
              className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">图例</p>
            <div className="space-y-2">
              {Object.entries(typeLabels).map(([type, label]) => (
                <div key={type} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colorMap[type] }}
                  />
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-80 card p-5 overflow-auto">
          <h3 className="font-semibold text-gray-900 mb-4">节点详情</h3>
          
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">名称</p>
                <p className="font-medium text-gray-900">{selectedNode.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">类型</p>
                <span 
                  className="tag mt-1"
                  style={{ 
                    backgroundColor: colorMap[selectedNode.type],
                    color: '#333'
                  }}
                >
                  {typeLabels[selectedNode.type]}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">连接数</p>
                <p className="font-medium text-gray-900">
                  {graphData.links.filter(l => 
                    l.source.id === selectedNode.id || l.target.id === selectedNode.id
                  ).length}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">点击节点查看详情</p>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">统计</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">节点数</span>
                <span className="font-medium">{graphData.nodes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">连接数</span>
                <span className="font-medium">{graphData.links.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">缩放</span>
                <span className="font-medium">{Math.round(zoom * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KnowledgeGraph
