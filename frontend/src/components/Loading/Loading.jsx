import React from "react";

export function  Loading  ({ isLoading })  {
  return (
    <div>
      {isLoading && (
        

            <span className="visually-hidden">Loading...</span>
         
     
      )}
    </div>
  );
};
