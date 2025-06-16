import React from "react";
import { motion } from "framer-motion";

const DirectionSelector = React.memo(({ direction, setDirection }) => (
  <div className="mb-6">
    <label
      htmlFor="direction"
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      转换方向
    </label>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <select
        id="direction"
        value={direction}
        onChange={(e) => setDirection(e.target.value)}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#60A5FA] focus:border-[#60A5FA] bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300"
      >
        <option value="t2s">繁体转简体</option>
        <option value="s2t">简体转繁体</option>
      </select>
    </motion.div>
  </div>
));

export default DirectionSelector;
