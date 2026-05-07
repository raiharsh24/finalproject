
export default function Layout({ children }) {
  return (
    <div className="flex h-screen w-full bg-[#f5f5f5] dark:bg-[#1a1a1a] overflow-hidden">
      {children}
    </div>
  );
}
