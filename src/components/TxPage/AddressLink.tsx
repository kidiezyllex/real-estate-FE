import type React from "react";

interface AddressLinkProps {
	address: string;
	isAsset?: boolean;
	isHash?: boolean;
	shorten?: boolean;
}

const AddressLink: React.FC<AddressLinkProps> = ({ address, isAsset = false, shorten = true }) => {
	let shortAddress: string = address;
	if (shorten) {
		shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
	}

	return (
		<a
			href={`/mev/address/${address}`}
			target="_blank"
			rel="noopener noreferrer"
			className="text-[#4DC3E2] hover:underline text-sm"
		>
			{shortAddress}
		</a>
	);
};

export default AddressLink;
