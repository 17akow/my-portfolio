import { HiHeart } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="flex items-center gap-1.5 text-sm text-gray-500">
          Built with{" "}
          <HiHeart size={14} className="text-red-500" /> using React &
          FastAPI
        </p>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Akbar. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
