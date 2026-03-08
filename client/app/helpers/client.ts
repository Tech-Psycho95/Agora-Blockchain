"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";
import { http } from "wagmi";
import { sepolia, avalancheFuji } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Agora-Blockchain",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [sepolia, avalancheFuji],
  ssr: true,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    [avalancheFuji.id]: http(process.env.NEXT_PUBLIC_FUJI_RPC_URL),
  },
});

export const queryClient = new QueryClient();
