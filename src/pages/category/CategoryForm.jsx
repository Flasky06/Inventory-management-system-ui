import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategory } from "../../context/CategoryContext";

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCategoryById, createCategory, updateCategory } = useCategory();

  const [name, setName] = useState("");

  useEffect(() => {
    if (id) {
      (async () => {
        const category = await getCategoryById(id);
        if (category) {
          setName(category.name || "");
        }
      })();
    }
  }, [id, getCategoryById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { name };

    if (id) {
      await updateCategory(id, body);
    } else {
      await createCategory(body);
    }
    navigate("/category");
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        {id ? "Edit Category" : "Create Category"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter category name"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            {id ? "Update Category" : "Create Category"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/category")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
