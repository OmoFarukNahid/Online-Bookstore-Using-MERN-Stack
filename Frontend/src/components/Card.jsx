import React from 'react';

function Card({ item }) {
  const isGoogleBook = item.isGoogleBook;
  const buttonText = isGoogleBook ? "View" : "Buy Now";
  
  // Handle button click - for Google books, open the actual book page
  const handleButtonClick = () => {
    if (isGoogleBook) {
      console.log("Google Book ID:", item.id);
      console.log("Google Book Data:", item);
      
      // Try multiple URL formats
      const googleBookUrl = `https://books.google.com/books?id=${item.id}`;
      const googlePreviewUrl = `https://books.google.com/books/about/?id=${item.id}`;
      const googleSearchUrl = `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(item.name)}`;
      
      console.log("Trying URL:", googleBookUrl);
      window.open(googleBookUrl, '_blank');
    } else {
      // Handle "Buy Now" for your books
      console.log("Buy now clicked for:", item.name);
    }
  };

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

            {!isGoogleBook && (
              <span className="badge badge-outline font-medium dark:text-gray-300 dark:border-gray-500">${item.Price}</span>
            )}
            
            <button 
              onClick={handleButtonClick}
              className={`px-3 py-1 border-2 rounded transition-colors duration-200 ${
                isGoogleBook 
                  ? "border-blue-400 dark:border-blue-500 text-blue-500 dark:text-blue-400 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white cursor-pointer"
                  : "border-amber-400 dark:border-amber-500 text-amber-500 dark:text-amber-400 hover:bg-amber-500 dark:hover:bg-amber-600 hover:text-white cursor-pointer"
              }`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;