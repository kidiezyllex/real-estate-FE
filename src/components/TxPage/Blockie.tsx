import type React from "react";
import { useEffect, useRef } from "react";

interface BlockieProps {
	address: string;
	size?: number;
}

const Blockie: React.FC<BlockieProps> = ({ address, size = 24 }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Simple hash function for demo purposes
		const hash = (str: string) => {
			let hash = 0;
			for (let i = 0; i < str.length; i++) {
				hash = (hash << 5) - hash + str.charCodeAt(i);
				hash = hash & hash;
			}
			return Math.abs(hash);
		};

		const addressHash = hash(address);

		// Generate a color based on the hash
		const r = addressHash % 255;
		const g = (addressHash * 7) % 255;
		const b = (addressHash * 13) % 255;

		// Fill the canvas with the color
		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
		ctx.fillRect(0, 0, size, size);

		// Add some patterns
		const patternSize = Math.floor(size / 3);
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if ((i + j) % 2 === 0) {
					const shade = (r + g + b) / 3 > 128 ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)";
					ctx.fillStyle = shade;
					ctx.fillRect(i * patternSize, j * patternSize, patternSize, patternSize);
				}
			}
		}
	}, [address, size]);

	return <canvas ref={canvasRef} width={size} height={size} className="rounded-full" />;
};

export default Blockie;
