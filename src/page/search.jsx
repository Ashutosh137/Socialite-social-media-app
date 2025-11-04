import React, { Fragment } from "react";
import { motion } from "framer-motion";
import Suggestion from "./../component/suggestion";
import { Helmet } from "react-helmet";

export default function Search() {
  return (
    <Fragment>
      <Helmet>
        <title>Explore | socilaite</title>
        <meta name="description" content="Explore" />
        <link rel="canonical" href="/Explore" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="Explore" />
        <meta name="author" content="Explore" />
        <meta name="language" content="EN" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full px-4 sm:px-6 lg:px-8 pb-20"
      >
        <Suggestion bio={true} />
      </motion.div>
    </Fragment>
  );
}
