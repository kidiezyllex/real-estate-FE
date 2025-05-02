import type React from "react";

interface TransactionHashLinkProps {
	hash: string;
	shorten?: boolean;
}

const TransactionHashLink: React.FC<TransactionHashLinkProps> = ({ hash, shorten = true }) => {
	let shortHash: string = hash;
	if (shorten) {
		shortHash = `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
	}

	return (
		<a
			href={`/mev/tx/${hash}`}
			target="_blank"
			rel="noopener noreferrer"
			className="text-[#4DC3E2] hover:underline text-sm"
		>
			{shortHash}
		</a>
	);
};

export default TransactionHashLink;
