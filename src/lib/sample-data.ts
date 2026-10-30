import black from "@/assets/shoe-black.jpg";
import white from "@/assets/shoe-white.jpg";
import runner from "@/assets/shoe-runner.jpg";
import hero from "@/assets/hero.jpg";
import type { Order, Product } from "./types";

export const SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];
const s = (n: number[]) => Object.fromEntries(SIZES.map((k, i) => [k, n[i] ?? 0]));

export const sampleProducts: Product[] = [
  { id: "p1", slug: "atelier-court-ivory", name: "Atelier Court", brand: "Maison Noir", category: "Court", price: 3290000,
    description: "Full-grain Italian calfskin, hand-stitched cupsole and gilded eyelets. A quiet classic built to age beautifully.",
    images: [white, hero, white], colors: [{ name: "Ivory", hex: "#efe9dc" }, { name: "Onyx", hex: "#151515" }],
    stock: s([4, 6, 8, 10, 9, 6, 3, 2]), featured: true, createdAt: "2026-09-01" },
  { id: "p2", slug: "nocturne-suede-low", name: "Nocturne Suede Low", brand: "Maison Noir", category: "Lifestyle", price: 3890000,
    description: "Tonal black suede over a leather frame, finished with a gum-free rubber sole for an all-night silhouette.",
    images: [black, black, hero], colors: [{ name: "Onyx", hex: "#151515" }],
    stock: s([2, 3, 5, 7, 6, 4, 2, 0]), featured: true, createdAt: "2026-09-12" },
  { id: "p3", slug: "vapor-trail-runner", name: "Vapor Trail Runner", brand: "Strada", category: "Running", price: 2590000,
    description: "Layered mesh and suede overlays on a sculpted foam midsole. Archive running heritage, refined.",
    images: [runner, runner, white], colors: [{ name: "Fog", hex: "#a9a9a5" }, { name: "Sand", hex: "#d8cbb2" }],
    stock: s([5, 8, 10, 12, 10, 8, 5, 3]), featured: true, createdAt: "2026-10-02" },
  { id: "p4", slug: "heritage-high-champagne", name: "Heritage High", brand: "Aurum", category: "High-top", price: 4290000,
    description: "A padded high-top in nappa leather with champagne hardware and a cushioned ortholite insole.",
    images: [hero, white, black], colors: [{ name: "Champagne", hex: "#cdb88a" }, { name: "Ivory", hex: "#efe9dc" }],
    stock: s([1, 2, 4, 4, 3, 2, 1, 1]), featured: true, createdAt: "2026-10-10" },
  { id: "p5", slug: "midnight-trainer", name: "Midnight Trainer", brand: "Strada", category: "Running", price: 2190000,
    description: "Lightweight daily trainer with breathable knit and responsive foam.",
    images: [black, runner], colors: [{ name: "Onyx", hex: "#151515" }, { name: "Fog", hex: "#a9a9a5" }],
    stock: s([3, 4, 6, 6, 5, 4, 2, 2]), createdAt: "2026-08-20" },
  { id: "p6", slug: "riviera-minimal", name: "Riviera Minimal", brand: "Aurum", category: "Lifestyle", price: 2890000,
    description: "Clean lines, tumbled leather and a slim profile designed for warm-weather dressing.",
    images: [white, runner], colors: [{ name: "Ivory", hex: "#efe9dc" }, { name: "Sand", hex: "#d8cbb2" }],
    stock: s([6, 6, 7, 8, 8, 6, 4, 2]), createdAt: "2026-07-15" },
];

export const sampleOrders: Order[] = [
  { id: "LX-10421", createdAt: "2026-10-28T09:12:00Z", payment: "COD", status: "delivered",
    customer: { name: "Nguyễn Minh Anh", phone: "0901234567", address: "12 Lê Lợi, Quận 1, TP.HCM" },
    items: [{ productId: "p1", size: "40", color: "Ivory", qty: 1, name: "Atelier Court", price: 3290000, image: white }],
    subtotal: 3290000, shipping: 0, total: 3290000 },
  { id: "LX-10422", createdAt: "2026-10-29T14:40:00Z", payment: "COD", status: "shipping",
    customer: { name: "Trần Quốc Bảo", phone: "0912345678", address: "45 Hai Bà Trưng, Hoàn Kiếm, Hà Nội" },
    items: [{ productId: "p3", size: "42", color: "Fog", qty: 2, name: "Vapor Trail Runner", price: 2590000, image: runner }],
    subtotal: 5180000, shipping: 0, total: 5180000 },
  { id: "LX-10423", createdAt: "2026-10-30T08:05:00Z", payment: "COD", status: "pending",
    customer: { name: "Lê Thu Hà", phone: "0987654321", address: "8 Trần Phú, Hải Châu, Đà Nẵng" },
    items: [{ productId: "p2", size: "39", color: "Onyx", qty: 1, name: "Nocturne Suede Low", price: 3890000, image: black }],
    subtotal: 3890000, shipping: 0, total: 3890000 },
];

export const formatPrice = (v: number) => v.toLocaleString("vi-VN") + " ₫";
export const SHIPPING_FEE = 30000;
export const FREE_SHIPPING_FROM = 2000000;
export const shippingFor = (subtotal: number) => (subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE);
