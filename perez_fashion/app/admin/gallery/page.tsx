'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  beforeImagePath: string;
  afterImagePath: string;
  category: string;
  isVisible: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function GalleryManagement() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState('');
  const [afterPreview, setAfterPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  // Fetch gallery items
  const fetchItems = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'before') {
        setBeforeImage(file);
        setBeforePreview(URL.createObjectURL(file));
      } else {
        setAfterImage(file);
        setAfterPreview(URL.createObjectURL(file));
      }
    }
  };

  // Upload single file
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.path;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!beforeImage || !afterImage) {
      alert('Please select both before and after images');
      return;
    }

    setUploading(true);

    try {
      // Upload both images
      const [beforePath, afterPath] = await Promise.all([
        uploadFile(beforeImage, 'gallery/before'),
        uploadFile(afterImage, 'gallery/after'),
      ]);

      // Create gallery item
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          beforeImagePath: beforePath,
          afterImagePath: afterPath,
          category,
          isVisible: true,
          displayOrder: 0,
        }),
      });

      if (response.ok) {
        // Reset form
        setTitle('');
        setDescription('');
        setCategory('general');
        setBeforeImage(null);
        setAfterImage(null);
        setBeforePreview('');
        setAfterPreview('');
        setShowAddForm(false);

        // Refresh list
        fetchItems();
        alert('Gallery item added successfully!');
      } else {
        throw new Error('Failed to create gallery item');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to add gallery item. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Toggle visibility
  const toggleVisibility = async (id: number, currentState: boolean) => {
    try {
      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isVisible: !currentState }),
      });

      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  // Delete item
  const deleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchItems();
        alert('Item deleted successfully');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gallery Management
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your before/after photos
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add New Item'}
        </button>
      </div>

      {/* Add New Item Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Add New Gallery Item
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Wedding Dress Alteration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="general">General</option>
                  <option value="wedding">Wedding</option>
                  <option value="alterations">Alterations</option>
                  <option value="custom">Custom Tailoring</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Brief description of the work..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Before Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'before')}
                  required
                  className="w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {beforePreview && (
                  <div className="mt-2 relative aspect-[3/4] w-full max-w-xs">
                    <Image
                      src={beforePreview}
                      alt="Before preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* After Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  After Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'after')}
                  required
                  className="w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                {afterPreview && (
                  <div className="mt-2 relative aspect-[3/4] w-full max-w-xs">
                    <Image
                      src={afterPreview}
                      alt="After preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? 'Uploading...' : 'Add Gallery Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
              !item.isVisible ? 'opacity-60' : ''
            }`}
          >
            <div className="grid grid-cols-2 gap-1">
              <div className="relative aspect-[3/4]">
                <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs font-semibold rounded z-10">
                  BEFORE
                </div>
                <Image
                  src={item.beforeImagePath}
                  alt="Before"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative aspect-[3/4]">
                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded z-10">
                  AFTER
                </div>
                <Image
                  src={item.afterImagePath}
                  alt="After"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {item.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  {item.category}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleVisibility(item.id, item.isVisible)}
                    className={`text-xs px-3 py-1 rounded ${
                      item.isVisible
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {item.isVisible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-xs px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No gallery items yet</p>
          <p className="text-sm">Click "Add New Item" to get started</p>
        </div>
      )}
    </div>
  );
}
