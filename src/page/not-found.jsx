import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
function Notfound() {
  return (
    <div className="flex justify-center align-middle w-full h-screen">
      <Helmet>
        <title>Not found | socilaite</title>
        <meta name="description" content="login" />
        <link rel="canonical" href="/login" />
        <meta name="robots" content="index, follow" />
       
        <meta name="keywords" content="login" />
        <meta name="author" content="login" />
        <meta name="language" content="EN" />
      </Helmet>
      <div className="text-center my-auto">
        <h1 className="mb-4 -mt-10 text-6xl font-semibold text-red-500">404</h1>
        <p className="mb-4 text-lg text-gray-500">
          Oops! Looks like you're lost.
        </p>
        <div className="animate-bounce">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </div>
        <p className="mt-4 text-gray-500">
          Let's get you back{" "}
          <Link to="/home" className="text-blue-300">
            Home
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default Notfound;
