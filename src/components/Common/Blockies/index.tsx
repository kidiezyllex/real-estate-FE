"use client";

import { useEffect, useRef } from "react";

interface BlockiesProps {
	address: string;
	size?: number;
	scale?: number;
	className?: string;
}

export function Blockies({ address, size = 15, className }: BlockiesProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const hash = (str: string) => {
			let hash = 0;
			for (let i = 0; i < str.length; i++) {
				hash = (hash << 5) - hash + str.charCodeAt(i);
				hash = hash & hash;
			}
			return Math.abs(hash);
		};

		const generateColor = (seed: number, index: number) => {
			const h = (seed + index * 50) % 360;
			const s = ((seed % 50) + 50) % 100;
			const l = ((seed % 30) + 30) % 60;
			return `hsl(${h}, ${s}%, ${l}%)`;
		};

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const seed = hash(address || "0x0000000000000000000000000000000000000000");

		const bgColor = generateColor(seed, 0);
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const patternColor = generateColor(seed, 1);
		ctx.fillStyle = patternColor;

		const cellSize = canvas.width / 5;

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 5; j++) {
				if ((seed + i * j) % 3 === 0) {
					ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
					ctx.fillRect((4 - i) * cellSize, j * cellSize, cellSize, cellSize);
				}
			}
		}
	}, [address]);

	return <canvas ref={canvasRef} width={size} height={size} className={className} />;
}
