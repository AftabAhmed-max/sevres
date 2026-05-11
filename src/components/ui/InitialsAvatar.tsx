// src/components/ui/InitialsAvatar.tsx

interface InitialsAvatarProps {
  name:   string;
  size?:  number;
  fontSize?: number;
}

export default function InitialsAvatar({
  name,
  size    = 48,
  fontSize,
}: InitialsAvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  const computedFontSize = fontSize ?? Math.round(size * 0.36);

  return (
    <div
      className="avatar-initials"
      style={{
        width:    `${size}px`,
        height:   `${size}px`,
        fontSize: `${computedFontSize}px`,
      }}
    >
      {initials}
    </div>
  );
}