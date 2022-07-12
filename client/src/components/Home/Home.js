import React, { useEffect } from "react";
import { getAllProducts } from "../../redux/product/productSlice";
import { useDispatch, useSelector } from "react-redux";

import ProductItem from "../product/ProductItem";
import Metadata from "../Metadata";

function Home() {
  const { data, loading } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getAllProducts({
        keyword: "",
        page: 1,
        category: "",
        price: [0, 25000],
        ratingValue: 0,
      })
    );
  }, [dispatch]);
  return (
    <>
      {loading ? (
        <p>loading</p>
      ) : (
        <>
          {" "}
          <Metadata title="eccomerce-Home" />
          <div className="bg-[#fff] flex flex-col gap-2 h-screen">
            {/* <PostHeader /> */}
            {/* <Banner /> */}
            {/* <Deals /> */}
            {/* <Trending /> */}
            {/* <h1 className="border-b border-slate-">Top Products</h1> */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {" "}
              {data.map((product) => {
                return <ProductItem product={product} key={product._id} />;
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;
