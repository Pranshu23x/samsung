import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  title: string;
};

export const Header = ({ title }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-50 mb-6 flex items-center justify-between rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-100 px-4 py-3 shadow-card lg:mt-[-8px]">
      <Link href="/courses">
        <Button
          size="sm"
          variant="ghost"
          className="rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
        >
          <ArrowLeft className="h-4 w-4 stroke-2" />
        </Button>
      </Link>

      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-emerald-500" />
        <h1 className="font-poppins text-base font-bold text-gray-800">{title}</h1>
      </div>

      <div className="w-9" aria-hidden />
    </div>
  );
};
