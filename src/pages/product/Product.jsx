import React from "react";
import TitleHeader from "../../components/common/TitleHeader";
import { useProduct } from "../../context/ProductContext";
import { Link } from "react-router-dom";
import { useCategory } from "../../context/CategoryContext";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const Product = () => {
  const { products, loading, deleteProduct } = useProduct(); // <-- include deleteProduct
  const { categories } = useCategory();

  if (loading) return <p className="p-4">Loading products...</p>;

  return (
    <div>
      <TitleHeader
        title="Products"
        pageTitle="Product Management"
        linkTitle="New Product Page"
        linkTo="/product/create-product"
      />
      <table className="w-full border-collapse bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Description</th>
            <th className="p-3 border-b">Material</th>
            <th className="p-3 border-b">Color</th>
            <th className="p-3 border-b">Size</th>
            <th className="p-3 border-b">Category </th>
            <th className="p-3 border-b">Price</th>
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{product.productName}</td>
              <td className="p-3 border-b">{product.description}</td>
              <td className="p-3 border-b">{product.material}</td>
              <td className="p-3 border-b">{product.color}</td>
              <td className="p-3 border-b">{product.size}</td>
              <td className="p-3 border-b">
                {categories.find(
                  (category) => category.id === product.categoryId
                )?.name || "Unknown"}
              </td>
              <td className="p-3 border-b">{product.price}</td>

              <td className="p-3 border-b text-center">
                <div className="flex justify-center gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Product;
