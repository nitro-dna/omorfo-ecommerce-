'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save,
  Copy,
  Send,
  FileText,
  Users,
  ShoppingCart,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  text: string
  type: 'welcome' | 'order_confirmation' | 'newsletter' | 'promotional' | 'custom'
  variables: string[]
  created_at: string
  updated_at: string
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    html: '',
    text: '',
    type: 'custom' as EmailTemplate['type']
  })

  const templateTypes = [
    { value: 'welcome', label: 'Welcome Email', icon: <Users className="w-4 h-4" /> },
    { value: 'order_confirmation', label: 'Order Confirmation', icon: <ShoppingCart className="w-4 h-4" /> },
    { value: 'newsletter', label: 'Newsletter', icon: <Mail className="w-4 h-4" /> },
    { value: 'promotional', label: 'Promotional', icon: <Bell className="w-4 h-4" /> },
    { value: 'custom', label: 'Custom Template', icon: <FileText className="w-4 h-4" /> }
  ]

  const defaultTemplates = [
    {
      id: 'welcome-1',
      name: 'Welcome Email',
      subject: 'Willkommen bei ómorfo!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Willkommen bei ómorfo!</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Hallo {{customer_name}},</h2>
            <p>Vielen Dank für Ihre Registrierung bei ómorfo!</p>
            <p>Wir freuen uns, Sie als Kunde begrüßen zu dürfen.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{shop_url}}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Jetzt einkaufen
              </a>
            </div>
          </div>
        </div>
      `,
      text: `
        Willkommen bei ómorfo!
        
        Hallo {{customer_name}},
        
        Vielen Dank für Ihre Registrierung bei ómorfo!
        Wir freuen uns, Sie als Kunde begrüßen zu dürfen.
        
        Jetzt einkaufen: {{shop_url}}
      `,
      type: 'welcome' as const,
      variables: ['{{customer_name}}', '{{shop_url}}'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'order-confirmation-1',
      name: 'Order Confirmation',
      subject: 'Bestellbestätigung - ómorfo #{{order_number}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Bestellbestätigung ✅</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Hallo {{customer_name}},</h2>
            <p>Vielen Dank für Ihre Bestellung!</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Bestelldetails:</h3>
              <p><strong>Bestellnummer:</strong> #{{order_number}}</p>
              <p><strong>Gesamtbetrag:</strong> {{order_total}}</p>
              <p><strong>Lieferadresse:</strong> {{shipping_address}}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{order_url}}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Bestellung verfolgen
              </a>
            </div>
          </div>
        </div>
      `,
      text: `
        Bestellbestätigung - ómorfo
        
        Hallo {{customer_name}},
        
        Vielen Dank für Ihre Bestellung!
        
        Bestelldetails:
        - Bestellnummer: #{{order_number}}
        - Gesamtbetrag: {{order_total}}
        - Lieferadresse: {{shipping_address}}
        
        Bestellung verfolgen: {{order_url}}
      `,
      type: 'order_confirmation' as const,
      variables: ['{{customer_name}}', '{{order_number}}', '{{order_total}}', '{{shipping_address}}', '{{order_url}}'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  useEffect(() => {
    // Load default templates
    setTemplates(defaultTemplates)
    setIsLoading(false)
  }, [])

  const handleCreateTemplate = () => {
    setSelectedTemplate(null)
    setFormData({
      name: '',
      subject: '',
      html: '',
      text: '',
      type: 'custom'
    })
    setIsEditing(true)
    setIsPreviewMode(false)
  }

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      subject: template.subject,
      html: template.html,
      text: template.text,
      type: template.type
    })
    setIsEditing(true)
    setIsPreviewMode(false)
  }

  const handleSaveTemplate = () => {
    if (!formData.name || !formData.subject || !formData.html) {
      toast.error('Please fill in all required fields')
      return
    }

    const newTemplate: EmailTemplate = {
      id: selectedTemplate?.id || `template-${Date.now()}`,
      ...formData,
      variables: extractVariables(formData.html),
      created_at: selectedTemplate?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (selectedTemplate) {
      setTemplates(templates.map(t => t.id === selectedTemplate.id ? newTemplate : t))
      toast.success('Template updated successfully')
    } else {
      setTemplates([...templates, newTemplate])
      toast.success('Template created successfully')
    }

    setIsEditing(false)
    setSelectedTemplate(null)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== templateId))
      toast.success('Template deleted successfully')
    }
  }

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setIsPreviewMode(true)
    setIsEditing(false)
  }

  const extractVariables = (html: string): string[] => {
    const variableRegex = /\{\{([^}]+)\}\}/g
    const variables = new Set<string>()
    let match

    while ((match = variableRegex.exec(html)) !== null) {
      variables.add(match[0])
    }

    return Array.from(variables)
  }

  const getTemplateIcon = (type: EmailTemplate['type']) => {
    const templateType = templateTypes.find(t => t.value === type)
    return templateType?.icon || <FileText className="w-4 h-4" />
  }

  const getTemplateTypeLabel = (type: EmailTemplate['type']) => {
    const templateType = templateTypes.find(t => t.value === type)
    return templateType?.label || 'Custom'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Templates</h1>
                <p className="text-gray-600">Manage and customize email templates</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button onClick={handleCreateTemplate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
                <Link href="/admin">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Templates List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Templates</h2>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">Loading templates...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTemplate?.id === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePreviewTemplate(template)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getTemplateIcon(template.type)}
                            <div className="ml-3">
                              <h3 className="font-medium text-gray-900">{template.name}</h3>
                              <p className="text-sm text-gray-500">{getTemplateTypeLabel(template.type)}</p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditTemplate(template)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTemplate(template.id)
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Template Editor/Preview */}
            <div className="lg:col-span-2">
              {isEditing ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedTemplate ? 'Edit Template' : 'Create Template'}
                    </h2>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveTemplate}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Template
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Name
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter template name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as EmailTemplate['type'] })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        {templateTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Subject
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Enter email subject"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        HTML Content
                      </label>
                      <Textarea
                        value={formData.html}
                        onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                        placeholder="Enter HTML content"
                        rows={10}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Content (Plain Text)
                      </label>
                      <Textarea
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        placeholder="Enter plain text content"
                        rows={6}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Available Variables</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractVariables(formData.html).map((variable) => (
                          <span
                            key={variable}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono"
                          >
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : isPreviewMode && selectedTemplate ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Template Preview</h2>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsPreviewMode(false)}>
                        Close Preview
                      </Button>
                      <Button onClick={() => handleEditTemplate(selectedTemplate)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Template
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Template Details</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p><strong>Name:</strong> {selectedTemplate.name}</p>
                        <p><strong>Type:</strong> {getTemplateTypeLabel(selectedTemplate.type)}</p>
                        <p><strong>Subject:</strong> {selectedTemplate.subject}</p>
                        <p><strong>Variables:</strong> {selectedTemplate.variables.join(', ')}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">HTML Preview</h3>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div dangerouslySetInnerHTML={{ __html: selectedTemplate.html }} />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Text Preview</h3>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 font-mono text-sm whitespace-pre-wrap">
                        {selectedTemplate.text}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Template</h3>
                    <p className="text-gray-600 mb-4">
                      Choose a template from the list to preview or edit it
                    </p>
                    <Button onClick={handleCreateTemplate}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Template
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
