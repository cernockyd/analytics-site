type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: Props) {
  return (
    <div
      className={
        className +
        ' relative w-full mx-auto text-left ring-1 max-w-none bg-white shadow border-blue-400 ring-gray-200 rounded-lg'
      }
    >
      {children}
    </div>
  );
}
