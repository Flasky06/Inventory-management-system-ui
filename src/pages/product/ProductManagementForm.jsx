import React, { useState, useEffect } from "react";
import { useCategory } from "../../context/CategoryContext";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../context/ProductContext";

const ProductManagementForm = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const { categories } = useCategory();
  const { createProduct, updateProduct, products, fetchProducts } =
    useProduct();
  const navigate = useNavigate();
  const { id } = useParams();

  // load products list when editing
  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id]);

  // when products arrive, populate form
  useEffect(() => {
    if (id && products.length > 0) {
      const product = products.find((p) => p.id === id);
      if (product) {
        setProductName(product.name);
        setDescription(product.description);
        setMaterial(product.material);
        setColor(product.color);
        setSize(product.size);
        setPrice(product.price);
        setCategoryId(product.categoryId);
      }
    }
  }, [id, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      productName,
      description,
      material,
      color,
      size,
      price,
      categoryId,
    };
    if (id) {
      await updateProduct(id, payload);
    } else {
      await createProduct(payload);
    }
    navigate("/product");
  };

  return (
    <div className="p-1 rounded-lg">
      <h2 className="text-xl font-bold mb-4 max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        {id ? "Edit Product" : "Create New Product"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-2 max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg"
      >
        {/* name */}
        <div className="flex flex-row items-center gap-4">
          <label className="block text-sm text-right font-medium mb-1 w-1/4">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-1/2 border rounded-lg px-3 py-1"
            required
          />
        </div>
        {/* description */}
        <div className="flex flex-row items-center gap-4">
          <label className="block text-sm text-right font-medium mb-1 w-1/4">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-1/2 border rounded-lg px-3 py-1"
            required
          />
        </div>
        {/* material */}
        <div className="flex flex-row items-center gap-4">
          <label className="block text-sm text-right font-medium mb-1 w-1/4">
            Material
          </label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-1/2 border rounded-lg px-3 py-1"
            required
          />
        </div>
        {/* color */}
        <div className="flex flex-row items-center gap-4">
          <label className="block text-sm text-right font-medium mb-1 w-1/4">
            Color
          </label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-1/2 border rounded-lg px-3 py-1"
            required
          />
        </div>
        {/* size */}
        <div className="flex flex-row items-center gap-4">
          <label className="block text-sm text-right font-medium mb-1 w-1/4">
            Size
          </label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-1/2 border rounded-lg px-3 py-1"
            required
          />
        </div>
        {/* price */}
        <div className="flex flex-row items-center gap-4">
          <label className="block text-sm text-right font-medium mb-1 w-1/4">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-1/2 border rounded-lg px-3 py-1"
            required
          />
        </div>
        {/* category */}
        <div className="flex flex-row items-center gap-4">
          <label className="block text-sm text-right font-medium mb-1 w-1/4">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-1/2 border rounded-lg px-3 py-1"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {id ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductManagementForm;
