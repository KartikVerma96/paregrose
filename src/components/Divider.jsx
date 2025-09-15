'use client';

const Divider = ({ text }) => {
  return (
    <div className="relative flex items-center justify-center w-full my-12">
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      {text && (
        <span className="absolute bg-white px-4 text-gray-500 text-sm font-medium">
          {text}
        </span>
      )}
    </div>
  );
};

export default Divider;
