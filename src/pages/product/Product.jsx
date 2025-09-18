import React from "react";
import TitleHeadComponent from "../../component/TitleHeadComponent";
import { useProduct } from "../../context/ProductContext";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCategory } from "../../context/CategoryContext";

const Product = () => {
  const { products, loading } = useProduct();

  if (loading) return <p className="p-4">Loading products...</p>;

  const { categories } = useCategory();
  return (
    <div>
      <TitleHeadComponent
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

              <td className="p-3 border-b text-center flex justify-center gap-3">
                <Link
                  to={`/product/${product.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
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
