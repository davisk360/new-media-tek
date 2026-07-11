import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FileText, Image, Settings, Plus, Edit, Trash2, Eye, EyeOff, Save, X, LogOut } from 'lucide-react';

// Only create Supabase client if environment variables are available
const supabase = import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY 
  ? createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    )
  : null;

const CMSDashboard = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [content, setContent] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('cms_auth_token');
    window.location.reload();
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!supabase) {
      console.error('Supabase client not available - check environment variables');
      setLoading(false);
      return;
    }

    try {
      const [contentRes, typesRes, mediaRes] = await Promise.all([
        supabase.from('content').select('*, content_types(name)').order('updated_at', { ascending: false }),
        supabase.from('content_types').select('*').order('name'),
        supabase.from('media').select('*').order('created_at', { ascending: false })
      ]);

      setContent(contentRes.data || []);
      setContentTypes(typesRes.data || []);
      setMedia(mediaRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (item) => {
    try {
      const { data, error } = item.id 
        ? await supabase.from('content').update({
            title: item.title,
            slug: item.slug,
            content: item.content,
            status: item.status,
            type_id: item.type_id
          }).eq('id', item.id).select()
        : await supabase.from('content').insert({
            title: item.title,
            slug: item.slug,
            content: item.content,
            status: item.status || 'draft',
            type_id: item.type_id
          }).select();

      if (error) throw error;
      
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await supabase.from('content').delete().eq('id', id);
      loadData();
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error deleting content');
    }
  };

  const toggleStatus = async (item) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      await supabase.from('content').update({ 
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null
      }).eq('id', item.id);
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const ContentEditor = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      ...item,
      content: item.content || {}
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const updateContent = (field, value) => {
      setFormData(prev => ({
        ...prev,
        content: { ...prev.content, [field]: value }
      }));
    };

    const contentType = contentTypes.find(t => t.id === formData.type_id);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {item.id ? 'Edit Content' : 'Create New Content'}
              </h3>
              <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Content Type</label>
                  <select
                    value={formData.type_id || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, type_id: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select type</option>
                    {contentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status || 'draft'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {contentType && contentType.fields && contentType.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-1">
                    {field.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={formData.content[field.name] || ''}
                      onChange={(e) => updateContent(field.name, e.target.value)}
                      className="w-full p-2 border rounded"
                      required={field.required}
                    />
                  )}
                  {field.type === 'rich_text' && (
                    <textarea
                      value={formData.content[field.name] || ''}
                      onChange={(e) => updateContent(field.name, e.target.value)}
                      className="w-full p-2 border rounded h-32"
                      required={field.required}
                    />
                  )}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={formData.content[field.name] || ''}
                      onChange={(e) => updateContent(field.name, parseInt(e.target.value))}
                      className="w-full p-2 border rounded"
                      required={field.required}
                    />
                  )}
                  {field.type === 'array' && (
                    <textarea
                      value={Array.isArray(formData.content[field.name]) 
                        ? formData.content[field.name].join('\n') 
                        : formData.content[field.name] || ''}
                      onChange={(e) => updateContent(field.name, e.target.value.split('\n').filter(Boolean))}
                      className="w-full p-2 border rounded h-24"
                      placeholder="Enter items, one per line"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading CMS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CMS Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your website content</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'content', label: 'Content', icon: FileText },
                { id: 'media', label: 'Media', icon: Image },
                { id: 'types', label: 'Content Types', icon: Settings },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'content' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Content Management</h2>
                  <button
                    onClick={() => setEditingItem({})}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Content
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {content.map(item => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.title}</div>
                              <div className="text-sm text-gray-500">{item.slug}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                              {item.content_types?.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'published' 
                                ? 'bg-green-100 text-green-800'
                                : item.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.updated_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleStatus(item)}
                                className="text-gray-600 hover:text-gray-900"
                                title={item.status === 'published' ? 'Unpublish' : 'Publish'}
                              >
                                {item.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => setEditingItem(item)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Media Library</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Media
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {media.map(item => (
                    <div key={item.id} className="border rounded-lg p-2">
                      <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-xs text-gray-600 truncate">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.file_type}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'types' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Content Types</h2>
                <div className="grid gap-4">
                  {contentTypes.map(type => (
                    <div key={type.id} className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">{type.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {type.fields.map(field => (
                          <span key={field.name} className="px-2 py-1 bg-gray-100 text-xs rounded">
                            {field.name} ({field.type})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingItem && (
        <ContentEditor
          item={editingItem}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default CMSDashboard;
