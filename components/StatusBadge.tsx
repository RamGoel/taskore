const StatusBadge = ({ label }: { label: string }) => {
  const RANDOM_COLOR_CLASSES = [
    "bg-green-500/30 text-green-500 border border-green-500",
    "bg-blue-500/30 text-blue-500 border border-blue-500",
    "bg-red-500/30 text-red-500 border border-red-500",
    "bg-yellow-500/30 text-yellow-500 border border-yellow-500",
    "bg-purple-500/30 text-purple-500 border border-purple-500",
    "bg-pink-500/30 text-pink-500 border border-pink-500",
  ];
  const randomColor =
    RANDOM_COLOR_CLASSES[
      Math.floor(Math.random() * RANDOM_COLOR_CLASSES.length)
    ];
  return (
    <p
      className={`text-xs font-medium ${randomColor} text-primary-foreground px-2 py-1 rounded-full w-fit`}
    >
      {label}
    </p>
  );
};

export default StatusBadge;
