"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/constants";

const LeftSideBar = () => {
  const pathName = usePathname();

  return (
    <div className="h-screen left-0 top-0 sticky p-20 flex flex-col gap-16 bg-black shadow-xl max-lg:hidden">
      <Image src="/logo5.webp" alt="logo" width={100} height={60} />

      <div className="flex flex-col gap-12">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium ${
              pathName === link.url ? "text-blue-400" : "text-grey-1"
            }`}
          >
            {link.icon} <p>{link.label}</p>
          </Link>
        ))}
      </div>
      <div className="flex gap-4 text-body-medium items-center">
        <UserButton />
        <p className="text-blue-200">Edit Profile</p>
      </div>
    </div>
  );
};

export default LeftSideBar;
