import React from "react";
import { motion } from "framer-motion";

const DirectionSelector = React.memo(({ direction, setDirection }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="mb-6"
    role="radiogroup"
    aria-label="选择转换方向"
  >
    <label className="mr-4">
      <input
        type="radio"
        value="t2s"
        checked={direction === "t2s"}
        onChange={() => setDirection("t2s")}
        className="mr-2"
        aria-checked={direction === "t2s"}
      />
      繁体转简体
    </label>
    <label>
      <input
        type="radio"
        value="s2t"
        checked={direction === "s2t"}
        onChange={() => setDirection("s2t")}
        className="mr-2"
        aria-checked={direction === "s2t"}
      />
      简体转繁体
    </label>
  </motion.div>
));

export default DirectionSelector;