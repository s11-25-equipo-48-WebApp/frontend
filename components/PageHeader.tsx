"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  backTo: {
    href: string;
    label: string;
  };
}

export default function PageHeader({ backTo }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Back Button */}
      <div className="mb-4">
        <Link
          href={backTo.href}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">{backTo.label}</span>
        </Link>
      </div>
    </div>
  );
}
