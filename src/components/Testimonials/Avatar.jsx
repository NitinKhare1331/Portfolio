"use client";
import { useState, memo } from "react";
import { getInitials, getAvatarColor } from "./utils";

/**
 * Avatar — fixed-size square to prevent layout shift between image/initials.
 */
const Avatar = memo(function Avatar({ name, imageUrl, size = 56, className = "" }) {
  const [failed, setFailed] = useState(false);
  const initials = getInitials(name);
  const bg = getAvatarColor(name);
  const style = { width: size, height: size, minWidth: size, minHeight: size };

  if (!imageUrl || failed) {
    return (
      <span
        className={`flex items-center justify-center rounded-full font-bold text-white select-none shrink-0 ${className}`}
        style={{ ...style, background: bg, fontSize: Math.round(size * 0.32) }}
        aria-label={`${name} initials avatar`}
      >
        {initials}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={name}
      width={size}
      height={size}
      className={`rounded-full object-cover shrink-0 ${className}`}
      style={style}
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
});

export default Avatar;
