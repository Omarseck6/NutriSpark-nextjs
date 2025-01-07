import { Metadata } from "next";
import React from "react";

export function generateMetadata({
  params,
}: {
  params: { name: string };
}): Metadata {
  const title = `Discover ${params.name} - NutriSpark`;
  const description = `Discover the nutritional values of ${params.name}. Use the search below to get started.`;

  return {
    title,
    description,
  };
}

export default function FoodLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
