/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { AuthContext } from "./Auth";
import { Button } from "./Button";
import { decryptFile } from "../util";
import { FaFileDownload, FaUserSecret } from "react-icons/fa";
import { setDoc } from "@junobuild/core";
import { nanoid } from "nanoid";
import { useRef } from "react";

export const Download = ({
  url,
  documentId,
  filename,
  mimeType,
  encrypted: _encrypted,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [passPhrase, setPassPhrase] = useState("");
  const [progress, setProgress] = useState(false);
  const [error, setError] = useState(null);
  const downloadElement = useRef(null);
  const encrypted =
    _encrypted != null ? _encrypted : (url || filename || "").endsWith(".enc");

  const { user } = useContext(AuthContext);

  const download = async () => {
    // Demo purpose therefore edge case not properly handled
    if ([null, undefined].includes(user)) {
      return;
    }

    setProgress(true);

    try {
      await setDoc({
        collection: "activity",
        doc: {
          key: nanoid(),
          description: documentId,
          data: {
            documentId,
            user: user.key,
            action: "download started",
          },
        },
      })
        .catch((err) => {
          console.error(err);
          setError(err.message);
        })
        .then(console.log);

      const file = await decryptFile(url, passPhrase, filename, mimeType).catch(
        (err) => {
          setError(err.message);
          throw err;
        }
      );
      downloadElement.current.href = file;
      downloadElement.current.download = filename;
      downloadElement.current.click();

      await setDoc({
        collection: "activity",
        doc: {
          key: nanoid(),
          description: documentId,
          data: {
            documentId,
            user: user.key,
            action: "download success",
          },
        },
      })
        .catch((err) => {
          console.error(err);
          setError(err.message);
        })

        .then(console.log);

      setShowModal(false);
      setPassPhrase("");
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setProgress(false);
    }
  };

  return (
    <div>
      <Button
        onClick={async (e) => {
          e.stopPropagation();
          if (encrypted) {
            setShowModal(true);
          } else {
            await setDoc({
              collection: "activity",
              doc: {
                key: nanoid(),
                description: documentId,
                data: {
                  documentId,
                  user: user.key,
                  action: "download success",
                },
              },
            })
              .catch((err) => {
                console.error(err);
                setError(err.message);
              })
              .then(console.log);
            downloadElement.current.href = url;
            downloadElement.current.download = filename;
            downloadElement.current.click();
          }
        }}
        disabled={showModal}
      >
        Download{" "}
        {encrypted ? (
          <FaUserSecret className="inline-block align-middle" />
        ) : undefined}
        <FaFileDownload className="inline-block align-middle" />
      </Button>
      <a
        alt="download"
        ref={downloadElement}
        className="hidden"
        href={url}
        download={filename}
      >
        download
      </a>

      {error ? (
        <p className="text-red-500 text-xs italic my-3">
          Download failed: {error}
        </p>
      ) : undefined}
      {showModal ? (
        <>
          <div className="my-3 animate-fade" role="dialog">
            <div className="relative w-full max-w-xl">
              <div className="mb-5 relative w-full max-w-xl">
                <label
                  htmlFor="passPhrase"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Decryption Pass Phrase
                </label>
                <input
                  id="passPhrase"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  type="password"
                  onChange={(e) => {
                    setPassPhrase(e.target.value);
                  }}
                  value={passPhrase}
                  disabled={progress}
                />
              </div>
            </div>
            <div className="relative w-full max-w-xl">
              {progress ? (
                <div
                  className="my-8 animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-indigo-600 rounded-full"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <div className="flex my-4">
                  <button
                    className="py-1 px-8 hover:text-blue-600 active:text-blue-400"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setPassPhrase("");
                    }}
                  >
                    Close
                  </button>

                  <Button onClick={download} disabled={passPhrase === ""}>
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
