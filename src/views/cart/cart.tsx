import React, { useState } from "react";

const Cart = () => {
  const initialProducts = [
    {
      id: 1,
      name: "منشفة",
      price: 10,
      image: "/images/products/towel.png",
      quantity: 0,
    },
    {
      id: 2,
      name: "بدلة سباحة",
      price: 10,
      image: "/images/products/swim-suit.png",
      quantity: 0,
    },
    {
      id: 3,
      name: "مجاذيف",
      price: 10,
      image: "/images/products/paddles.png",
      quantity: 0,
    },
    {
      id: 4,
      name: "زعانف",
      price: 10,
      image: "/images/products/flippers.png",
      quantity: 0,
    },
    {
      id: 5,
      name: "عوامة سحب",
      price: 10,
      image: "/images/products/pull-buoy.png",
      quantity: 0,
    },
    {
      id: 6,
      name: "قبعة",
      price: 10,
      image: "/images/products/cap.png",
      quantity: 0,
    },
    {
      id: 7,
      name: "زجاجة ماء",
      price: 10,
      image: "/images/products/water-bottle.png",
      quantity: 0,
    },
    {
      id: 8,
      name: "لوح ركوب الأمواج",
      price: 10,
      image: "/images/products/kickboard.png",
      quantity: 0,
    },
    {
      id: 9,
      name: "نظارات سباحة",
      price: 10,
      image: "/images/products/swim-goggles.png",
      quantity: 0,
    },
    {
      id: 10,
      name: "سنوركل",
      price: 10,
      image: "/images/products/snorkel.png",
      quantity: 0,
    },
    {
      id: 11,
      name: "حقيبة شبكية",
      price: 10,
      image: "/images/products/mesh-bag.png",
      quantity: 0,
    },
    {
      id: 12,
      name: "حقيبة سوداء",
      price: 10,
      image: "/images/products/bag.png",
      quantity: 0,
    },
    {
      id: 13,
      name: "حقيبة وردية",
      price: 10,
      image: "/images/products/bag-pink.png",
      quantity: 0,
    },
    {
      id: 14,
      name: "زوومرز",
      price: 10,
      image: "/images/products/zoomers.png",
      quantity: 0,
    },
  ];

  const [products, setProducts] = useState(initialProducts);

  const updateQuantity = (id: any, change: any) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(0, product.quantity + change) }
          : product
      )
    );
  };

  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  return (
    <div className="container px-2 md:mx-auto mt-10 text-right">
      <h1 className="md:text-2xl font-bold mb-5 ">سلة المشتريات</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-2 items-center w-full">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-white p-4 rounded shadow-lg mb-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-10 w-10 lg:w-20 lg:h-20 rounded"
              />
              <div className="flex ml-4">
                <h2 className="text-lg">{product.name}</h2>
                <div className="mx-2">-</div>
                <p className="text-gray-500">₪{product.price}</p>
              </div>
              <div className="flex items-center">
                <button
                  className="bg-gray-200 text-gray-600 hover:bg-gray-300 font-bold py-1 px-3 rounded"
                  onClick={() => updateQuantity(product.id, -1)}
                  disabled={product.quantity <= 0}
                >
                  -
                </button>
                <span className="px-4 text-lg ">{product.quantity}</span>
                <button
                  className="bg-gray-200 text-gray-600 hover:bg-gray-300 font-bold py-1 px-3 rounded"
                  onClick={() => updateQuantity(product.id, 1)}
                >
                  +
                </button>
                <p className=" w-20 text-center">₪{product.price * product.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-2">الملخص:</h2>
          <hr className=" border-b-1 border-blueGray-300 mb-6" />

          {products
            .filter((product) => product.quantity > 0)
            .map((product) => (
              <>

                <div key={product.id} className="flex justify-between mb-2">
                  <span>
                    {product.name} (x{product.quantity})
                  </span>
                  <span>₪{product.price * product.quantity}</span>
                </div>
                <hr className="border-b-1 border-blueGray-300 my-2" />

              </>
            ))}

          <div className="flex justify-between font-bold text-lg mt-10">
            <span>الإجمالي:</span>
            <span>₪{totalPrice}</span>
          </div>
          <button className="mt-5 w-full bg-pink text-white  py-2 rounded">
            إتمام الشراء
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
