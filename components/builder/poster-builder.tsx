'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Circle, 
  Triangle, 
  Palette,
  Download,
  Save,
  RotateCw,
  Trash2,
  Layers,
  Eye,
  EyeOff,
  Copy,
  Undo,
  Redo
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface CanvasElement {
  id: string
  type: 'text' | 'image' | 'shape'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  visible: boolean
  properties: {
    text?: string
    fontSize?: number
    fontFamily?: string
    color?: string
    backgroundColor?: string
    imageUrl?: string
    shapeType?: 'rectangle' | 'circle' | 'triangle'
    borderWidth?: number
    borderColor?: string
    opacity?: number
  }
}

interface PosterTemplate {
  id: string
  name: string
  thumbnail: string
  width: number
  height: number
  backgroundColor: string
  elements: CanvasElement[]
}

interface PosterBuilderProps {
  onSave?: (design: any) => void
  onExport?: (imageData: string) => void
  className?: string
}

const FONT_FAMILIES = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Poppins',
  'Montserrat',
  'Playfair Display',
  'Merriweather'
]

const COLOR_PALETTES = [
  ['#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1'],
  ['#2C3E50', '#E74C3C', '#F39C12', '#27AE60', '#8E44AD'],
  ['#34495E', '#E67E22', '#F1C40F', '#2ECC71', '#9B59B6'],
  ['#1ABC9C', '#3498DB', '#F39C12', '#E74C3C', '#95A5A6']
]

const POSTER_TEMPLATES: PosterTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    thumbnail: '/templates/minimal.jpg',
    width: 800,
    height: 1200,
    backgroundColor: '#FFFFFF',
    elements: [
      {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 200,
        width: 600,
        height: 100,
        rotation: 0,
        zIndex: 1,
        visible: true,
        properties: {
          text: 'Your Text Here',
          fontSize: 48,
          fontFamily: 'Inter',
          color: '#000000'
        }
      }
    ]
  },
  {
    id: 'vintage',
    name: 'Vintage',
    thumbnail: '/templates/vintage.jpg',
    width: 800,
    height: 1200,
    backgroundColor: '#F5E6D3',
    elements: [
      {
        id: 'text-1',
        type: 'text',
        x: 100,
        y: 200,
        width: 600,
        height: 100,
        rotation: 0,
        zIndex: 1,
        visible: true,
        properties: {
          text: 'Vintage Style',
          fontSize: 56,
          fontFamily: 'Playfair Display',
          color: '#8B4513'
        }
      }
    ]
  }
]

export function PosterBuilder({ onSave, onExport, className = '' }: PosterBuilderProps) {
  const { data: session } = useSession()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 1200 })
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [showTemplates, setShowTemplates] = useState(false)
  const [showToolbar, setShowToolbar] = useState(true)
  const [history, setHistory] = useState<CanvasElement[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Initialize with default template
  useEffect(() => {
    if (elements.length === 0) {
      loadTemplate(POSTER_TEMPLATES[0])
    }
  }, [])

  // Save to history
  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newElements])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements([...history[historyIndex - 1]])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements([...history[historyIndex + 1]])
    }
  }

  // Load template
  const loadTemplate = (template: PosterTemplate) => {
    setCanvasSize({ width: template.width, height: template.height })
    setBackgroundColor(template.backgroundColor)
    setElements([...template.elements])
    setSelectedElement(null)
    saveToHistory([...template.elements])
    setShowTemplates(false)
    toast.success(`Loaded ${template.name} template`)
  }

  // Add element
  const addElement = (type: 'text' | 'image' | 'shape') => {
    const newElement: CanvasElement = {
      id: `${type}-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      rotation: 0,
      zIndex: elements.length + 1,
      visible: true,
      properties: {
        text: type === 'text' ? 'New Text' : '',
        fontSize: type === 'text' ? 24 : undefined,
        fontFamily: type === 'text' ? 'Inter' : undefined,
        color: '#000000',
        backgroundColor: type === 'shape' ? '#FF6B6B' : undefined,
        shapeType: type === 'shape' ? 'rectangle' : undefined,
        opacity: 1
      }
    }

    const newElements = [...elements, newElement]
    setElements(newElements)
    setSelectedElement(newElement.id)
    saveToHistory(newElements)
  }

  // Update element
  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    )
    setElements(newElements)
    saveToHistory(newElements)
  }

  // Delete element
  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id)
    setElements(newElements)
    setSelectedElement(null)
    saveToHistory(newElements)
    toast.success('Element deleted')
  }

  // Duplicate element
  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id)
    if (!element) return

    const newElement: CanvasElement = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
      zIndex: elements.length + 1
    }

    const newElements = [...elements, newElement]
    setElements(newElements)
    setSelectedElement(newElement.id)
    saveToHistory(newElements)
    toast.success('Element duplicated')
  }

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault()
    setSelectedElement(elementId)
    setIsDragging(true)
    
    const element = elements.find(el => el.id === elementId)
    if (element) {
      setDragOffset({
        x: e.clientX - element.x,
        y: e.clientY - element.y
      })
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedElement) return

    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    updateElement(selectedElement, { x: newX, y: newY })
  }, [isDragging, selectedElement, dragOffset, updateElement])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Export design
  const exportDesign = async () => {
    if (!canvasRef.current) return

    try {
      // Create a canvas element
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = canvasSize.width
      canvas.height = canvasSize.height

      // Draw background
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw elements (simplified - in real implementation you'd render each element)
      elements.forEach(element => {
        if (!element.visible) return

        ctx.save()
        ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
        ctx.rotate(element.rotation * Math.PI / 180)

        if (element.type === 'text') {
          ctx.font = `${element.properties.fontSize}px ${element.properties.fontFamily}`
          ctx.fillStyle = element.properties.color || '#000000'
          ctx.textAlign = 'center'
          ctx.fillText(element.properties.text || '', 0, 0)
        } else if (element.type === 'shape') {
          ctx.fillStyle = element.properties.backgroundColor || '#FF6B6B'
          ctx.fillRect(-element.width / 2, -element.height / 2, element.width, element.height)
        }

        ctx.restore()
      })

      const imageData = canvas.toDataURL('image/png')
      onExport?.(imageData)
      toast.success('Design exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export design')
    }
  }

  // Save design
  const saveDesign = async () => {
    if (!session?.user?.email) {
      toast.error('Please sign in to save designs')
      return
    }

    try {
      const design = {
        name: `Design ${Date.now()}`,
        canvasSize,
        backgroundColor,
        elements,
        created_at: new Date().toISOString()
      }

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (!user) return

      await supabase
        .from('user_designs')
        .insert({
          user_id: user.id,
          design_data: design
        })

      onSave?.(design)
      toast.success('Design saved successfully')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save design')
    }
  }

  const selectedElementData = elements.find(el => el.id === selectedElement)

  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Templates */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Templates</h3>
              <div className="grid grid-cols-2 gap-2">
                {POSTER_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template)}
                    className="p-2 border border-gray-200 rounded hover:border-accent-500 transition-colors"
                  >
                    <div className="w-full h-16 bg-gray-100 rounded mb-1"></div>
                    <span className="text-xs text-gray-600">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Elements */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Add Elements</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addElement('text')}
                  className="p-3 border border-gray-200 rounded hover:border-accent-500 transition-colors"
                >
                  <Type className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                  <span className="text-xs text-gray-600">Text</span>
                </button>
                <button
                  onClick={() => addElement('image')}
                  className="p-3 border border-gray-200 rounded hover:border-accent-500 transition-colors"
                >
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                  <span className="text-xs text-gray-600">Image</span>
                </button>
                <button
                  onClick={() => addElement('shape')}
                  className="p-3 border border-gray-200 rounded hover:border-accent-500 transition-colors"
                >
                  <Square className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                  <span className="text-xs text-gray-600">Shape</span>
                </button>
              </div>
            </div>

            {/* Element Properties */}
            {selectedElementData && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Properties</h3>
                <div className="space-y-3">
                  {/* Text Properties */}
                  {selectedElementData.type === 'text' && (
                    <>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Text</label>
                        <input
                          type="text"
                          value={selectedElementData.properties.text || ''}
                          onChange={(e) => updateElement(selectedElementData.id, {
                            properties: { ...selectedElementData.properties, text: e.target.value }
                          })}
                          className="w-full p-2 text-sm border border-gray-200 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Font Size</label>
                        <input
                          type="number"
                          value={selectedElementData.properties.fontSize || 24}
                          onChange={(e) => updateElement(selectedElementData.id, {
                            properties: { ...selectedElementData.properties, fontSize: parseInt(e.target.value) }
                          })}
                          className="w-full p-2 text-sm border border-gray-200 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Font Family</label>
                        <select
                          value={selectedElementData.properties.fontFamily || 'Inter'}
                          onChange={(e) => updateElement(selectedElementData.id, {
                            properties: { ...selectedElementData.properties, fontFamily: e.target.value }
                          })}
                          className="w-full p-2 text-sm border border-gray-200 rounded"
                        >
                          {FONT_FAMILIES.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* Color */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Color</label>
                    <input
                      type="color"
                      value={selectedElementData.properties.color || '#000000'}
                      onChange={(e) => updateElement(selectedElementData.id, {
                        properties: { ...selectedElementData.properties, color: e.target.value }
                      })}
                      className="w-full h-8 border border-gray-200 rounded"
                    />
                  </div>

                  {/* Opacity */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Opacity</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedElementData.properties.opacity || 1}
                      onChange={(e) => updateElement(selectedElementData.id, {
                        properties: { ...selectedElementData.properties, opacity: parseFloat(e.target.value) }
                      })}
                      className="w-full"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => duplicateElement(selectedElementData.id)}
                      className="flex-1 p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      <Copy className="w-3 h-3 mx-auto" />
                    </button>
                    <button
                      onClick={() => deleteElement(selectedElementData.id)}
                      className="flex-1 p-2 text-xs bg-red-100 hover:bg-red-200 text-red-600 rounded"
                    >
                      <Trash2 className="w-3 h-3 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Canvas Properties */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Canvas</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-8 border border-gray-200 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowToolbar(!showToolbar)}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <Layers className="w-5 h-5" />
              </button>
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                <Undo className="w-5 h-5" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                <Redo className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={saveDesign}
                className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Save
              </button>
              <button
                onClick={exportDesign}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            ref={canvasRef}
            className="relative border border-gray-300 shadow-lg"
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              backgroundColor,
              transform: 'scale(0.8)',
              transformOrigin: 'center'
            }}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move ${
                  selectedElement === element.id ? 'ring-2 ring-accent-500' : ''
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  transform: `rotate(${element.rotation}deg)`,
                  zIndex: element.zIndex,
                  opacity: element.properties.opacity || 1
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                onClick={() => setSelectedElement(element.id)}
              >
                {element.type === 'text' && (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      fontSize: element.properties.fontSize,
                      fontFamily: element.properties.fontFamily,
                      color: element.properties.color
                    }}
                  >
                    {element.properties.text}
                  </div>
                )}
                {element.type === 'shape' && (
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundColor: element.properties.backgroundColor,
                      borderRadius: element.properties.shapeType === 'circle' ? '50%' : '0'
                    }}
                  />
                )}
                {element.type === 'image' && element.properties.imageUrl && (
                  <img
                    src={element.properties.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
