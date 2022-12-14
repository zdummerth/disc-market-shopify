import React, { useState } from "react";
import Image from "next/image";
import Price from "./products/Price";
import { useCart } from "../context/CartContextProvider";
import { toast } from "react-toastify";

export default function LineItem({ lineItem }) {
  // console.log(lineItem)
  const { removeCartItems, updateCartItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSelectChange = async (e) => {
    const qtyInt = parseInt(e.target.value);
    try {
      setLoading(true);
      await updateCartItem([
        {
          id: lineItem.id,
          merchandiseId: lineItem.merchandise.id,
          quantity: qtyInt,
        },
      ]);
    } catch (e) {
      console.log("error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await removeCartItems([lineItem.id]);
      toast.success("Item Deleted", {
        autoClose: 1500,
        closeOnClick: true,
      });
    } catch (e) {
      console.log("error", e);
      setLoading(false);
    }
  };

  const { merchandise } = lineItem;
  // console.log(merchandise);
  const imgSrc = merchandise.image?.src;
  //   const qtyAvailble =
  //     merchandise.quantityAvailable === 0 ? 100 : merchandise.quantityAvailable;
  const availableForSaleArray = Array.from(Array(100).keys()).map((k) => k + 1);

  return (
    <div className="flex justify-between border rounded p-2">
      <div className="flex">
        <div className="relative w-24 h-24 mr-2">
          {imgSrc ? (
            <Image src={imgSrc} alt="test" layout="fill" objectFit="cover" />
          ) : (
            <div>No image uploaded</div>
          )}
        </div>
        <div className="flex-col fai-fs">
          <div>{merchandise.product.title}</div>
          <div className="font-size-sm">{merchandise.title}</div>
          <div>
            <Price price={merchandise.priceV2.amount} />
          </div>
        </div>
      </div>

      <div className="flex-col fai-fe fjc-sb">
        <div className="flex fai-c mb-s">
          <button onClick={handleDelete} disabled={loading}>
            delete
          </button>
        </div>
        <div className="flex fai-c">
          {loading ? (
            <div>...updating</div>
          ) : (
            <>
              {lineItem.merchandise.availableForSale && (
                <select
                  onChange={handleSelectChange}
                  defaultValue={lineItem.quantity}
                  name=""
                  id=""
                  className="bg-gray-900"
                  style={{
                    width: "70px",
                  }}
                >
                  {availableForSaleArray.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
