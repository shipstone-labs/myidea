/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { listDocs } from "@junobuild/core";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Auth";
import { Delete } from "./Delete";
import { useCallback, useMemo, Fragment } from "react";

import {
	useTable,
	useGlobalFilter,
	useSortBy,
	usePagination,
} from "react-table";
import {
	FaSearch,
	FaChevronDown,
	FaCheck,
	FaChevronLeft,
	FaChevronRight,
	FaSortUp,
	FaSortDown,
} from "react-icons/fa";
import { Listbox, Transition } from "@headlessui/react";
import { Download } from "./Download.jsx";

function Avatar({ src, alt = "avatar" }) {
	return (
		<img src={src} alt={alt} className="w-8 h-8 rounded-full object-contain" />
	);
}

const getColumns = () => [
	{
		Header: "Created At",
		accessor: "created_at",
		// Cell: ({ row, value }) => {
		// 	return (
		// 		<div className="flex gap-2 items-center">
		// 			<Avatar src={row.original.image} alt={`${value}'s Avatar`} />
		// 			<div>{value}</div>
		// 		</div>
		// 	);
		// },
		Cell: ({ value }) => {
			const date = value ? new Date(Number(BigInt(value) / 1000000n)) : "";
			let nano = value ? Number(value % 1000000n) : 0;
			while (nano.length < 6) {
				nano = `0${nano}`;
			}
			const title = date ? date.toISOString().replace(/Z$/, `${nano}Z`) : "";
			return <div title={title}>{date ? date.toLocaleDateString() : ""}</div>;
		},
	},
	{
		Header: "Updated At",
		accessor: "updated_at",
		Cell: ({ value }) => {
			const date = value ? new Date(Number(BigInt(value) / 1000000n)) : "";
			let nano = value ? Number(value % 1000000n) : 0;
			while (nano.length < 6) {
				nano = `0${nano}`;
			}
			const title = date ? date.toISOString().replace(/Z$/, `${nano}Z`) : "";
			return <div title={title}>{date ? date.toLocaleDateString() : ""}</div>;
		},
	},
	{
		Header: "Decrypt At",
		accessor: "decrypt_at",
		Cell: ({ value }) => {
			const date = value ? new Date(Number(BigInt(value) / 1000000n)) : "";
			let nano = value ? Number(value % 1000000n) : 0;
			while (nano.length < 6) {
				nano = `0${nano}`;
			}
			const title = date ? date.toISOString().replace(/Z$/, `${nano}Z`) : "";
			return <div title={title}>{date ? date.toLocaleDateString() : ""}</div>;
		},
	},
	{
		Header: "Inventor",
		accessor: "data.inventor",
		Cell: ({ value }) => {
			return (
				<div className="flex gap-2 items-center">
					<div>{value}</div>
				</div>
			);
		},
	},
	{
		Header: "Title",
		accessor: "data.title",
		Cell: ({ row, value }) => {
			return (
				<div
					className="flex gap-2 items-center"
					title={row.original.description}
				>
					<Avatar
						src={row.original.data.image || "/lightbulb-custom.png"}
						alt={`${value}'s Image`}
					/>
					<div>{value}</div>
				</div>
			);
		},
	},
	{
		Header: "File",
		accessor: "data.filename",
		Cell: ({ row }) => {
			const {
				url,
				filename,
				mimeType,
				encrypted: _encrypted,
			} = row.original.data;
			const encrypted =
				_encrypted != null
					? _encrypted
					: (filename || url || "").endsWith(".enc");
			return url !== undefined ? (
				<Download
					encrypted={encrypted}
					url={url}
					filename={filename}
					mimeType={mimeType}
				/>
			) : undefined;
		},
	},
	{
		Header: "Tags",
		accessor: "data.tags",
		Cell: ({ value }) => {
			return <div>{(value || []).join(", ")}</div>;
		},
	},
	{
		Header: "Delete",
		Cell: ({ row }) => {
			return <Delete id={row.original} />;
		},
	},
];

function InputGroup7({
	label,
	name,
	value,
	onChange,
	type = "text",
	decoration,
	className = "",
	inputClassName = "",
	decorationClassName = "",
	disabled,
}) {
	return (
		<div
			className={`flex flex-row-reverse items-stretch w-full rounded-xl overflow-hidden bg-white shadow-[0_4px_10px_rgba(0,0,0,0.03)] ${className}`}
		>
			<input
				id={name}
				name={name}
				value={value}
				type={type}
				placeholder={label}
				aria-label={label}
				onChange={onChange}
				className={`peer block w-full p-3 text-gray-600 focus:outline-none focus:ring-0 appearance-none ${
					disabled ? "bg-gray-200" : ""
				} ${inputClassName}`}
				disabled={disabled}
			/>
			<div
				className={`flex items-center pl-3 py-3 text-gray-600 ${
					disabled ? "bg-gray-200" : ""
				} ${decorationClassName}`}
			>
				{decoration}
			</div>
		</div>
	);
}

function GlobalSearchFilter1({
	globalFilter,
	setGlobalFilter,
	className = "",
}) {
	return (
		<InputGroup7
			name="search"
			value={globalFilter || ""}
			onChange={(e) => setGlobalFilter(e.target.value)}
			label="Search"
			decoration={<FaSearch size="1rem" className="text-gray-400" />}
			className={className}
		/>
	);
}

function SelectMenu1({ value, setValue, options, className = "", disabled }) {
	const selectedOption = useMemo(
		() => options.find((o) => o.id === value),
		[options, value],
	);
	return (
		<Listbox value={value} onChange={setValue} disabled={disabled}>
			<div className={`relative w-full ${className}`}>
				<Listbox.Button
					className={`relative w-full  rounded-xl py-3 pl-3 pr-10 text-base text-gray-700 text-left shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none
          ${
						disabled
							? "bg-gray-200 cursor-not-allowed"
							: "bg-white cursor-default"
					}
        
        `}
				>
					<span className="block truncate">{selectedOption.caption}</span>
					<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
						<FaChevronDown
							size="0.80rem"
							className="text-gray-400"
							aria-hidden="true"
						/>
					</span>
				</Listbox.Button>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white text-base shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none">
						{options.map((option) => (
							<Listbox.Option
								key={option.id}
								className={({ active }) =>
									`relative cursor-default select-none py-3 pl-10 pr-4 ${
										active ? "bg-red-100" : ""
									}`
								}
								value={option.id}
							>
								{({ selected }) => (
									<>
										<span
											className={`block truncate ${
												selected ? "font-medium" : "font-normal"
											}`}
										>
											{option.caption}
										</span>
										{selected ? (
											<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-400">
												<FaCheck size="0.5rem" aria-hidden="true" />
											</span>
										) : null}
									</>
								)}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	);
}

function Button2({ content, onClick, active, disabled }) {
	return (
		<button
			type="button"
			className={`flex flex-col cursor-pointer items-center justify-center w-9 h-9 shadow-[0_4px_10px_rgba(0,0,0,0.03)] text-sm font-normal transition-colors rounded-lg
      ${active ? "bg-red-500 text-white" : "text-red-500"}
      ${
				!disabled
					? "bg-white hover:bg-red-500 hover:text-white"
					: "text-red-300 bg-white cursor-not-allowed"
			}
      `}
			onClick={onClick}
			disabled={disabled}
		>
			{content}
		</button>
	);
}

function PaginationNav1({
	gotoPage,
	canPreviousPage,
	canNextPage,
	pageCount,
	pageIndex,
}) {
	const renderPageLinks = useCallback(() => {
		if (pageCount === 0) return null;
		const visiblePageButtonCount = 3;
		let numberOfButtons =
			pageCount < visiblePageButtonCount ? pageCount : visiblePageButtonCount;
		const pageIndices = [pageIndex];
		numberOfButtons--;
		[...Array(numberOfButtons)].forEach((_item, itemIndex) => {
			const pageNumberBefore = pageIndices[0] - 1;
			const pageNumberAfter = pageIndices[pageIndices.length - 1] + 1;
			if (
				pageNumberBefore >= 0 &&
				(itemIndex < numberOfButtons / 2 || pageNumberAfter > pageCount - 1)
			) {
				pageIndices.unshift(pageNumberBefore);
			} else {
				pageIndices.push(pageNumberAfter);
			}
		});
		return pageIndices.map((pageIndexToMap) => (
			<li key={pageIndexToMap}>
				<Button2
					content={pageIndexToMap + 1}
					onClick={() => gotoPage(pageIndexToMap)}
					active={pageIndex === pageIndexToMap}
				/>
			</li>
		));
	}, [pageCount, pageIndex, gotoPage]);
	return (
		<ul className="flex gap-2">
			<li>
				<Button2
					content={
						<div className="flex ml-1">
							<FaChevronLeft size="0.6rem" />
							<FaChevronLeft size="0.6rem" className="-translate-x-1/2" />
						</div>
					}
					onClick={() => gotoPage(0)}
					disabled={!canPreviousPage}
				/>
			</li>
			{renderPageLinks()}
			<li>
				<Button2
					content={
						<div className="flex ml-1">
							<FaChevronRight size="0.6rem" />
							<FaChevronRight size="0.6rem" className="-translate-x-1/2" />
						</div>
					}
					onClick={() => gotoPage(pageCount - 1)}
					disabled={!canNextPage}
				/>
			</li>
		</ul>
	);
}

function TableComponent({
	getTableProps,
	headerGroups,
	getTableBodyProps,
	rows,
	prepareRow,
}) {
	return (
		<div className="w-full min-w-[30rem] p-4 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.03)]">
			<table {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th
									{...column.getHeaderProps(column.getSortByToggleProps())}
									className="px-3 text-start text-xs font-light uppercase cursor-pointer"
									style={{ width: column.width }}
								>
									<div className="flex gap-2 items-center">
										<div className="text-gray-600">
											{column.render("Header")}
										</div>
										<div className="flex flex-col">
											<FaSortUp
												className={`text-sm translate-y-1/2 ${
													column.isSorted && !column.isSortedDesc
														? "text-red-400"
														: "text-gray-300"
												}`}
											/>
											<FaSortDown
												className={`text-sm -translate-y-1/2 ${
													column.isSortedDesc ? "text-red-400" : "text-gray-300"
												}`}
											/>
										</div>
									</div>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map((row) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()} className="hover:bg-gray-100">
								{row.cells.map((cell) => {
									return (
										<td
											{...cell.getCellProps()}
											className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg"
										>
											{cell.render("Cell")}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

function Table1() {
	const { user } = useContext(AuthContext);
	const [data, setItems] = useState([]);

	const list = useCallback(async () => {
		const { items } = await listDocs({
			collection: "notes",
			filter: {},
		});

		setItems(items);
	}, []);

	useEffect(() => {
		window.addEventListener("reload", list);

		return () => {
			window.removeEventListener("reload", list);
		};
	}, [list]);

	useEffect(() => {
		if ([undefined, null].includes(user)) {
			setItems([]);
			return;
		}

		(async () => await list())();
	}, [user, list]);

	const columns = useMemo(getColumns, []);
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		state,
		setGlobalFilter,
		page: rows,
		canPreviousPage,
		canNextPage,
		pageCount,
		gotoPage,
		setPageSize,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageSize: 5 },
		},
		useGlobalFilter,
		useSortBy,
		usePagination,
	);
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col sm:flex-row justify-between gap-2">
				<GlobalSearchFilter1
					className="sm:w-64"
					globalFilter={state.globalFilter}
					setGlobalFilter={setGlobalFilter}
				/>
				<SelectMenu1
					className="sm:w-44"
					value={pageSize}
					setValue={setPageSize}
					options={[
						{ id: 5, caption: "5 items per page" },
						{ id: 10, caption: "10 items per page" },
						{ id: 20, caption: "20 items per page" },
					]}
				/>
			</div>
			<TableComponent
				getTableProps={getTableProps}
				headerGroups={headerGroups}
				getTableBodyProps={getTableBodyProps}
				rows={rows}
				prepareRow={prepareRow}
			/>
			<div className="flex justify-center">
				<PaginationNav1
					gotoPage={gotoPage}
					canPreviousPage={canPreviousPage}
					canNextPage={canNextPage}
					pageCount={pageCount}
					pageIndex={pageIndex}
				/>
			</div>
		</div>
	);
}

export function Table() {
	return (
		<div className="flex flex-col overflow-auto py-4 sm:py-0">
			<Table1 />
		</div>
	);
}
