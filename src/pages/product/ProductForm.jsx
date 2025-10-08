// src/pages/product/ProductManagementForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../context/ProductContext";
import { useCategory } from "../../context/CategoryContext";

const ProductManagementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, createProduct, updateProduct } = useProduct();
  const { categories } = useCategory();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Prefill on edit
  useEffect(() => {
    if (id) {
      (async () => {
        const product = await getProductById(id);
        if (product) {
          setProductName(product.productName || "");
          setDescription(product.description || "");
          setMaterial(product.material || "");
          setColor(product.color || "");
          setSize(product.size || "");
          setPrice(product.price || "");
          setCategoryId(product.categoryId || "");
        }
      })();
    }
  }, [id, getProductById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      productName,
      description,
      material,
      color,
      size,
      price: parseFloat(price),
      categoryId,
    };

    if (id) {
      await updateProduct(id, body);
    } else {
      await createProduct(body);
    }
    navigate("/product");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        {id ? "Edit Product" : "Create Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Material</label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {id ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductManagementForm;
