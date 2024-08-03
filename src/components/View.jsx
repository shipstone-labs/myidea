/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AuthContext } from "./Auth";
import { Backdrop } from "./Backdrop";
import { TagsInput } from "react-tag-input-component";
import { Avatar } from "./Table";
import { Download } from "./Download";
import { FaCopy, FaMedal } from "react-icons/fa";
import { deleteDoc, listDocs, setDoc, setManyDocs } from "@junobuild/core";
import { useState } from "react";
import { useEffect } from "react";
import { FaCheck, FaX } from "react-icons/fa6";
import { useCallback } from "react";
import { nanoid } from "nanoid";

export const DisplayDate = ({ value, long }) => {
  const date = value ? new Date(Number(BigInt(value) / 1000000n)) : "";
  let nano = value ? Number(value % 1000000n) : 0;
  while (nano.length < 6) {
    nano = `0${nano}`;
  }
  const title = date ? date.toISOString().replace(/Z$/, `${nano}Z`) : "";
  return (
    <span title={title}>
      {date ? (long ? date.toLocaleString() : date.toLocaleDateString()) : ""}
    </span>
  );
};

export const CopyToClipboardButton = ({ content }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error("Unable to copy to clipboard:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mx-3"
      title="Copy to Clipboard"
    >
      <FaCopy />
    </button>
  );
};

export const View = ({ row, onClose, requests }) => {
  const { user } = useContext(AuthContext);
  const {
    data: {
      inventor,
      title,
      description,
      tags,
      image,
      decrypt_at,
      filename,
      url,
      encrypted,
    } = {},
    key,
  } = row?.original || {};
  const docRequests = requests?.[key] || [];
  const publicDate = decrypt_at
    ? new Date(Number(BigInt(decrypt_at) / 1000000n))
        .toISOString()
        .split("T")[0]
    : null;
  const [activity, setActivity] = useState([]);
  useEffect(() => {
    (async () => {
      if (!key) {
        return;
      }
      const activity = await listDocs({
        collection: "activity",
        filter: {
          matcher: {
            description: key,
          },
          order: {
            field: "created_at",
            desc: false,
          },
        },
      }).catch((error) => {
        console.error(error);
        return {
          items: [],
          items_length: 0,
          items_page: undefined,
          matches_length: 0n,
          matches_pages: undefined,
        };
      });
      setActivity(activity);
    })();
  }, [key]);
  const [requesting, setRequesting] = useState(false);
  const requestAccess = useCallback(
    async (e) => {
      e.stopPropagation();
      if (
        !row?.original?.readers?.includes(user.key) &&
        true // row.original.owner !== user.key
      ) {
        setRequesting(true);
        setTimeout(async () => {
          try {
            const key = nanoid();
            await setDoc({
              collection: "requests",
              doc: {
                key,
                description: `${row.original.owner}:${user.key}`,
                data: {
                  documentId: row.original.key,
                  user: user.key,
                  action: "request access",
                },
              },
            });
            await setDoc({
              collection: "activity",
              doc: {
                key,
                description: row.original.key,
                data: {
                  documentId: row.original.key,
                  user: user.key,
                  owner: row.original.owner,
                  action: "request access to document",
                },
              },
            });
            onClose();
          } finally {
            setRequesting(false);
          }
        });
      }
    },
    [row, user.key, onClose]
  );
  const approveRequest = useCallback(
    async (approve, { item, corresponding }) => {
      const { data: { user } = {} } = item;
      setRequesting(true);
      setTimeout(async () => {
        try {
          await setManyDocs({
            docs: [
              {
                collection: "notes",
                doc: {
                  ...row.original,
                  data: {
                    ...row.original.data,
                    // Dumb and simple "set" handling.
                    readers: approve
                      ? [...(row.original.data.readers || []), user]
                          .filter((item) => item != null)
                          .reduce((acc, item) => {
                            if (acc.includes(item)) {
                              return acc;
                            }
                            acc.push(item);
                            return acc;
                          }, [])
                      : (row.original.data.readers || [])
                          .filter((item) => item !== user && item != null)
                          .reduce((acc, item) => {
                            if (acc.includes(item)) {
                              return acc;
                            }
                            acc.push(item);
                            return acc;
                          }, []),
                  },
                },
              },
              {
                collection: "activity",
                doc: {
                  key: nanoid(),
                  data: {
                    ...corresponding.data,
                    action: approve ? "request approved" : "request rejected",
                  },
                },
              },
            ],
          });
          await deleteDoc({
            collection: "requests",
            doc: corresponding,
          });
          onClose();
        } catch (err) {
          console.error(err);
          alert(err.message);
        } finally {
          window.dispatchEvent(new Event("reload"));
          setRequesting(false);
        }
      }, 100);
    },
    [row, onClose]
  );
  const hasAccess =
    row?.original?.owner === user.key ||
    row?.original?.readers?.includes(user.key);
  return (
    <>
      {row ? (
        <>
          <form
            className="absolute top-5 inset-0 z-50 p-1 md:px-24 animate-fade"
            role="dialog"
          >
            <div className="mb-5 relative w-full max-w-xl">
              <label
                htmlFor="inventor"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Created At
              </label>
              <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <DisplayDate value={row.original.created_at} />
              </div>
            </div>
            <div className="mb-5 relative w-full max-w-xl">
              <label
                htmlFor="owner"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Created By
              </label>
              <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <span id="owner" title={row.original.owner}>
                  {row.original.owner === user.key ? (
                    <span>
                      &nbsp;
                      <FaMedal className="inline-block align-middle" /> ME
                    </span>
                  ) : (
                    <span>
                      &nbsp;
                      <FaMedal className="inline-block align-middle" /> someone
                      else
                    </span>
                  )}
                </span>
                <CopyToClipboardButton content={row.original.owner} />
              </div>
            </div>
            <div className="mb-5 relative w-full max-w-xl">
              <label
                htmlFor="owner"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                I Have Access
              </label>
              <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <span id="owner" title={row.original.owner}>
                  {hasAccess ? (
                    <span>
                      &nbsp;
                      <FaCheck className="inline-block align-middle" /> Yes{" "}
                    </span>
                  ) : (
                    <span>
                      &nbsp;
                      <FaX className="inline-block align-middle" /> No{" "}
                    </span>
                  )}
                  {!requests[row.original.key]?.some(
                    (item) => item.data.user === user.key
                  ) && row.original.owner !== user.key ? (
                    <button
                      onClick={requestAccess}
                      type="button"
                      disabled={requesting}
                      className={`inline-block gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                        requesting
                          ? "opacity-25"
                          : "hover:bg-blue-600 dark:hover:bg-blue-300 dark:hover:text-black active:bg-blue-400 dark:active:bg-blue-500 active:shadow-none active:translate-x-[5px] active:translate-y-[5px]"
                      }`}
                    >
                      Request
                    </button>
                  ) : undefined}
                </span>
                <CopyToClipboardButton content={row.original.owner} />
              </div>
            </div>
            {row.original.data?.readers?.length ? (
              <div className="mb-5 relative w-full max-w-xl">
                <label
                  htmlFor="owner"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Users Who Have Access
                </label>
                <div className="bg-gray-50 mb-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <ul className="flex flex-col">
                    {row.original.data?.readers?.map((item) => {
                      return (
                        <div key={item} className="flex flex-row flex-cols-2">
                          <div className="flex flex-col grow">
                            <small>{item}</small>
                          </div>
                        </div>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ) : undefined}
            <div className="mb-5 relative w-full max-w-xl">
              <label
                htmlFor="inventor"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Inventor
              </label>
              <input
                type="text"
                id="inventor"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                placeholder="Inventor"
                readOnly
                value={inventor}
              />
            </div>

            <div className="mb-5 relative w-full max-w-xl">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                placeholder="Title"
                readOnly
                value={title}
              />
            </div>

            <div className="relative w-full max-w-xl">
              <div className="bg-gray-50 mb-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <Avatar
                  src={image || "/lightbulb-custom.png"}
                  alt="Thumbnail"
                  large
                />
              </div>
            </div>

            <div className="mb-5 relative w-full max-w-xl">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                rows={7}
                placeholder="Description"
                readOnly
                value={description}
              />
            </div>

            <div className="mb-5 relative w-full max-w-xl">
              <label
                htmlFor="tags"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tags
              </label>
              <TagsInput
                id="tags"
                readOnly
                disabled={true}
                value={tags || []}
                name="tags"
                placeHolder="Enter tags"
              />
            </div>

            {hasAccess ? (
              <div className="relative w-full max-w-xl">
                <div className="bg-gray-50 mb-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <Download
                    documentId={row.original.key}
                    filename={filename}
                    url={url}
                    encrypted={encrypted}
                  />
                  {filename != null ? (
                    <div className="relative w-full max-w-xl">
                      <div className="flex items-center my-3">
                        <input
                          checked={encrypted}
                          readOnly
                          id="checked-checkbox"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checked-checkbox"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Encrypted
                        </label>
                      </div>
                      {encrypted ? (
                        <>
                          <div className="mb-5 relative w-full max-w-xl">
                            <label
                              htmlFor="decryptionDate"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Decryption Date
                            </label>
                            <input
                              id="decryptionDate"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              required
                              placeholder="Decryption Notification Date"
                              type="date"
                              value={publicDate}
                              readOnly
                            />
                          </div>
                        </>
                      ) : undefined}
                    </div>
                  ) : undefined}
                </div>
                <div className="relative w-full max-w-xl">
                  <label
                    htmlFor="decryptionDate"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Activity
                  </label>
                  <div className="bg-gray-50 mb-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <ul className="flex flex-col">
                      {activity.items?.map((item) => {
                        const corresponding = docRequests.find(
                          (req) =>
                            req.data.documentId === item.data.documentId &&
                            req.key === item.key
                        );
                        return (
                          <div
                            key={item.key}
                            className="flex flex-row flex-cols-2"
                          >
                            <div className="flex flex-col grow">
                              {item.data.action}
                              {item.data.owner === user.key && corresponding ? (
                                <>
                                  <div className="flex flex-row">
                                    <small>{corresponding.data.user}</small>
                                  </div>
                                  <div className="flex flex-row">
                                    <button
                                      type="button"
                                      disabled={requesting}
                                      className={`inline-block gap-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 ${
                                        requesting
                                          ? "opacity-25"
                                          : "hover:bg-green-600 dark:hover:bg-green-300 dark:hover:text-black active:bg-green-400 dark:active:bg-green-500 active:shadow-none active:translate-x-[5px] active:translate-y-[5px]"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        approveRequest(true, {
                                          item,
                                          corresponding,
                                        });
                                      }}
                                    >
                                      <FaCheck className="inline-block" />{" "}
                                      Approve
                                    </button>
                                    <button
                                      type="button"
                                      disabled={requesting}
                                      className={`inline-block gap-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ${
                                        requesting
                                          ? "opacity-25"
                                          : "hover:bg-red-600 dark:hover:bg-red-300 dark:hover:text-black active:bg-red-400 dark:active:bg-red-500 active:shadow-none active:translate-x-[5px] active:translate-y-[5px]"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        approveRequest(false, {
                                          item,
                                          corresponding,
                                        });
                                      }}
                                    >
                                      <FaX className="inline-block" /> Reject
                                    </button>
                                  </div>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                            <small className="inline-block flex flex-col w-[18em] text-right">
                              <span>
                                {corresponding == null &&
                                item.owner === user.key ? (
                                  <>
                                    <FaMedal className="inline-block align-middle" />{" "}
                                    ME
                                  </>
                                ) : (
                                  ""
                                )}{" "}
                                at <DisplayDate value={item.created_at} long />
                              </span>
                            </small>
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <div className="flex my-4">
                  <button
                    className="py-1 px-8 hover:text-blue-600 active:text-blue-400"
                    type="button"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : undefined}
          </form>
          <Backdrop />
        </>
      ) : null}
    </>
  );
};
