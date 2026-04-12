"use client";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter:  { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0 },
  exit:   { opacity: 0, y: -16 },
};

/**
 * TestimonialContent — right panel.
 * Shows a large " + drop-cap first letter + rest of quote (italic).
 */
const TestimonialContent = memo(function TestimonialContent({ testimonial }) {
  const firstChar = testimonial.quote.charAt(0);
  const rest = testimonial.quote.slice(1);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={testimonial.id}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.32, ease: "easeInOut" }}
        className="flex flex-col justify-center h-full px-8 md:px-12"
      >
        {/* Large opening curly quote mark (hidden on mobile) */}
        <p
          className="hidden md:block text-gray-800 leading-none select-none mb-2"
          style={{ fontSize: 80, fontFamily: "Georgia, serif", lineHeight: 1, color: "#111827" }}
          aria-hidden="true"
        >
          &ldquo;
        </p>

        {/* Quote with drop-cap first letter */}
        <p
          className="text-gray-700 text-sm md:text-base leading-relaxed max-w-md"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
        >
          <span
            className="float-left mr-1 text-gray-900 font-bold"
            style={{ fontSize: "2em", lineHeight: 0.85, fontStyle: "normal" }}
          >
            {firstChar}
          </span>
          {rest}
        </p>
      </motion.div>
    </AnimatePresence>
  );
});

export default TestimonialContent;
