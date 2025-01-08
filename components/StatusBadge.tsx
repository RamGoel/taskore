const StatusBadge = ({ label }: { label: string }) => {
  const RANDOM_COLOR_CLASSES = [
    "bg-gray-500/30 text-gray-300 border border-gray-500",
  ];
  const randomColor =
    RANDOM_COLOR_CLASSES[
      Math.floor(Math.random() * RANDOM_COLOR_CLASSES.length)
    ];
  return (
    <p
      className={`text-xs font-medium ${randomColor} px-2 py-1 rounded-full w-fit`}
    >
      {label}
    </p>
  );
};

export default StatusBadge;
