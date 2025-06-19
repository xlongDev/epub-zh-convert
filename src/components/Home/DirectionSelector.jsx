import React from "react";
import { motion } from "framer-motion";

const DirectionSelector = React.memo(({ direction, setDirection }) => {
  const options = [
    { value: "t2s", label: "繁体转简体" },
    { value: "s2t", label: "简体转繁体" },
  ];

  return (
    <div className="mb-8">
      {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        转换方向
      </label> */}
      <div className="flex space-x-4">
        {options.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex-1"
          >
            <input
              id={`direction-${option.value}`}
              type="radio"
              value={option.value}
              checked={direction === option.value}
              onChange={() => setDirection(option.value)}
              className="hidden"
            />
            <label
              htmlFor={`direction-${option.value}`}
              className={`block w-full text-center py-3 px-4 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${
                direction === option.value
                  ? "bg-blue-500 text-white shadow-md dark:bg-blue-600"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {option.label}
            </label>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default DirectionSelector;