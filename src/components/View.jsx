/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AuthContext } from "./Auth";
import { Backdrop } from "./Backdrop";
import { TagsInput } from "react-tag-input-component";
import { Avatar } from "./Table";
import { Download } from "./Download";
import { FaCopy, FaMedal } from "react-icons/fa";
import { listDocs } from "@junobuild/core";
import { useState } from "react";
import { useEffect } from "react";

export const DisplayDate = ({ value }) => {
  const date = value ? new Date(Number(BigInt(value) / 1000000n)) : "";
  let nano = value ? Number(value % 1000000n) : 0;
  while (nano.length < 6) {
    nano = `0${nano}`;
  }
  const title = date ? date.toISOString().replace(/Z$/, `${nano}Z`) : "";
  return <span title={title}>{date ? date.toLocaleDateString() : ""}</span>;
};

export const CopyToClipboardButton = ({ content }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      console.log("Copied to clipboard:", content);
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

export const View = ({ row, onClose }) => {
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
                  <ul>
                    {activity.items?.map((item) => {
                      return (
                        <li key={item.key}>
                          <span>
                            {item.owner}{" "}
                            {item.owner === user.key ? (
                              <span>
                                &nbsp;
                                <FaMedal className="inline-block align-middle" />{" "}
                                ME
                              </span>
                            ) : (
                              ""
                            )}{" "}
                            on <DisplayDate value={item.created_at} />
                          </span>
                          &nbsp;&nbsp;
                          {item.data.action}
                        </li>
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
          </form>
          <Backdrop />
        </>
      ) : null}
    </>
  );
};
