import Image from "next/image";
import Link from "next/link";
import { BookOpen, Mail, MessageCircle, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-gray-100 bg-white">
      {/* Gradient top line */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-lime-400 to-sky-500" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-3">
              <Image src="/mascot.svg" alt="Reading Buddy" height={36} width={36} />
              <span className="font-poppins text-xl font-extrabold gradient-text-green">
                Reading Buddy
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
              Building confident readers one lesson at a time. AI-powered reading practice with gamification to keep kids motivated.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: MessageCircle, href: "#" },
                { icon: Heart, href: "#" },
                { icon: Mail, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-all hover:bg-emerald-100 hover:text-emerald-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="mb-4 font-poppins text-sm font-bold uppercase tracking-wider text-gray-900">
              Product
            </h3>
            <ul className="space-y-3 text-sm text-gray-500">
              {["Learn", "Leaderboard", "Quests", "Shop"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="transition-colors hover:text-emerald-600"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="mb-4 font-poppins text-sm font-bold uppercase tracking-wider text-gray-900">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-gray-500">
              {["Help Center", "Privacy Policy", "Terms of Service", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="transition-colors hover:text-emerald-600">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 text-sm text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Reading Buddy. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
            <span>Made with love for young readers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
