"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FC } from "react";

const BackButton: FC = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
    >
      <ArrowLeft size={20} />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
