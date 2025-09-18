import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";

const TitleHeadComponent = ({ pageTitle, linkTitle, linkTo }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold">{pageTitle}</h1>
      <Link
        to={linkTo}
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        {linkTitle}
      </Link>
    </div>
  );
};

export default TitleHeadComponent;
