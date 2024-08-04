/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { listDocs } from "@junobuild/core";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Auth";
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
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { DisplayDate } from "./View.jsx";
import { GiIncomingRocket } from "react-icons/gi";

export function Avatar({ src, alt = "avatar", large = false }) {
  return (
    <img
      src={src}
      alt={alt}
      className={large ? "w-32 h-32 object-contain" : "w-8 h-8 object-contain"}
    />
  );
}

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
      className={`flex flex-row-reverse items-stretch w-full rounded-xl overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.03)] ${className}`}
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
    [options, value]
  );
  return (
    <Listbox value={value} onChange={setValue} disabled={disabled}>
      <div className={`relative w-full ${className}`}>
        <ListboxButton
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
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute bg-white dark:bg-black z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl text-base shadow-[0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none">
            {options.map((option) => (
              <ListboxOption
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
              </ListboxOption>
            ))}
          </ListboxOptions>
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
  setFocusedRow,
}) {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="w-full min-w-[30rem] p-4 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.03)]">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key, ...rest } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={key} {...rest}>
                  {headerGroup.headers.map((column) => {
                    const { key, ...rest } = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );
                    return (
                      <th
                        key={key}
                        {...rest}
                        className="px-1 text-start text-xs font-light uppercase cursor-pointer"
                        style={{ width: column.width }}
                      >
                        <div className="flex gap-1 items-center">
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
                                column.isSortedDesc
                                  ? "text-red-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              const { key, ...rest } = row.getRowProps();
              return (
                <tr
                  key={key}
                  {...rest}
                  className="hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusedRow(row);
                  }}
                >
                  {row.cells.map((cell) => {
                    const { key, ...rest } = cell.getCellProps();
                    return (
                      <td
                        key={key}
                        {...rest}
                        className={
                          row.original.owner === user.key ||
                          row.original?.data?.readers?.includes(user.key)
                            ? "p-1 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg"
                            : "p-1 text-sm font-normal text-gray-400 first:rounded-l-lg last:rounded-r-lg"
                        }
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
    </>
  );
}

function Table1({ setFocusedRow, requests }) {
  const { user } = useContext(AuthContext);
  const [data, setItems] = useState([]);

  const list = useCallback(async () => {
    const { items } = await listDocs({
      collection: "notes",
      filter: {
        order: {
          field: "created_at",
          desc: true,
        },
      },
    });
    let inventor = localStorage.getItem("inventor");
    for (const { owner, data } of items) {
      if (!inventor && owner === user.key) {
        localStorage.setItem("inventor", data.inventor);
        inventor = data.inventor;
      }
    }
    setItems(items);
  }, [user]);

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

  const columns = useMemo(
    () => [
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ value }) => {
          return <DisplayDate value={value} long />;
        },
      },
      {
        Header: "Inventor",
        accessor: (row) => {
          return row.data.inventor;
        },
        Cell: ({ row }) => {
          return (
            <div className="flex gap-2 items-center">
              <div>{row.original.data.inventor}</div>
            </div>
          );
        },
      },
      {
        Header: "Title",
        accessor: (row) => {
          return row.data.title;
        },
        width: "15%",
        Cell: ({ row }) => {
          return (
            <div
              className="flex gap-2 items-center"
              title={row.original.description}
            >
              <Avatar
                src={row.original.data.image || "/lightbulb-custom.png"}
                alt={`${row.original.data.title}'s Image`}
              />
              <p className="max-w-[150px] text-ellipsis overflow-hidden whitespace-nowrap">
                {row.original.data.title}
              </p>
            </div>
          );
        },
      },
      {
        Header: "Description",
        width: "auto",
        accessor: (row) => {
          return row.data.description;
        },
        Cell: ({ row }) => {
          const { description: _description } = row.original.data || {};
          const description =
            _description?.length > 137
              ? `${_description.slice(0, 137)}...`
              : _description;
          return (
            <div className="flex gap-2 items-center max-height-[3em] text-ellipsis">
              <div>{description}</div>
            </div>
          );
        },
      },
      {
        Header: "Activity",
        accessor: (row) => {
          return row.data.file;
        },
        Cell: ({ row }) => {
          if (
            !row.original.data.readers?.includes(user.key) &&
            row.original.owner !== user.key
          ) {
            return <div>Request Access</div>;
          }
          const hasRequest =
            (requests?.[row.original.key] || []).length > 0 &&
            user.key === row.original.owner;
          const {
            data: { url, filename, mimeType, encrypted: _encrypted },
          } = row.original;
          const encrypted =
            _encrypted != null
              ? _encrypted
              : (url || filename || "").endsWith(".enc");
          return url && filename ? (
            <div title={`url=${url}, filename=${filename}`}>
              {mimeType}, {encrypted ? "encrypted" : "plain"}
              {""}
              {hasRequest ? (
                <span className="ms-2 border border-gray-300 p-0.5 rounded-lg">
                  <GiIncomingRocket className="text-red-500 inline-block" />{" "}
                  Request
                </span>
              ) : undefined}
            </div>
          ) : undefined;
        },
      },
      {
        Header: "Tags",
        accessor: (row) => {
          return row.data.tags?.join(",") || "";
        },
        Cell: ({ row }) => {
          const value = row.original.data.tags;
          return <div>{(value || []).join(", ")}</div>;
        },
      },
    ],
    [requests, user]
  );

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
      initialState: {
        pageSize: 5,
        sortBy: [
          {
            id: "created_at",
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  return (
    <div className="flex flex-col gap-2">
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
        setFocusedRow={setFocusedRow}
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

export function Table({ setFocusedRow, requests }) {
  return (
    <div className="flex flex-col overflow-auto py-4 sm:py-0">
      <Table1 setFocusedRow={setFocusedRow} requests={requests} />
    </div>
  );
}
