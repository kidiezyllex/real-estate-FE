import { cn } from "@/lib/utils";
import { Pagination as AntPagination } from "antd";

export interface PaginationProps {
	className?: string;
	current: number;
	pageSize: number;
	total: number;
	onChange: (page: number, pageSize: number) => void;
}

const Pagination = ({ className, current, pageSize, total, onChange, ...props }: PaginationProps) => {
	return (
		<div className={cn("flex justify-end py-4", className)}>
			<AntPagination
				current={current}
				pageSize={pageSize}
				total={total}
				onChange={onChange}
				showSizeChanger={false}
				{...props}
			/>
		</div>
	);
};

export { Pagination };
