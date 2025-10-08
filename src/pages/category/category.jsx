import React, { useState } from "react";
import { useCategory } from "../../context/CategoryContext";
import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import TitleHeadComponent from "../../components/common/TitleHeader";

const Category = () => {
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategory();

  // form state
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateCategory(editingId, { name });
      setEditingId(null);
    } else {
      await createCategory({ name });
    }
    setName("");
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
  };

  if (loading) return <p className="p-4">Loading categories...</p>;

  return (
    <div className="p-6">
      <TitleHeadComponent
        pageTitle="Category Management"
        linkTitle="New Category Page"
        linkTo="/category/create-category"
      />

      {/* Inline add/edit form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center gap-3">
          <label className="block text-sm font-medium mb-1 w-1/4">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5" />
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {/* Table */}
      <table className="w-full border-collapse bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{category.name}</td>
              <td className="p-3 border-b text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    type="button"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    type="button"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="2" className="text-center p-4 text-gray-500">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Category;
