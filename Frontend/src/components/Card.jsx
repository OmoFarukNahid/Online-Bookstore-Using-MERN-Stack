import React from 'react';

function Card({ item }) {
  return (
    <div className="px-2">
      <div className="card bg-base-100 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl overflow-hidden">
        <figure className="overflow-hidden rounded-t-xl">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </figure>
        <div className="card-body p-4">
          <h2 className="card-title text-lg md:text-xl font-semibold dark:text-white flex justify-between items-start">
            {item.name}
            <span className="badge badge-secondary text-sm dark:bg-emerald-600 dark:text-white">{item.category}</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{item.title}</p>
          <div className="card-actions justify-between mt-4">
            <span className="badge badge-outline font-medium dark:text-gray-300 dark:border-gray-500">${item.Price}</span>
            <button className="px-3 py-1 border-2 border-amber-400 dark:border-amber-500 text-amber-500 dark:text-amber-400 rounded hover:bg-amber-500 dark:hover:bg-amber-600 hover:text-white transition-colors duration-200">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;