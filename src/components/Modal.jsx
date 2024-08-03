import { setDoc, uploadFile } from "@junobuild/core";
import { nanoid } from "nanoid";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./Auth";
import { Backdrop } from "./Backdrop";
import { Button } from "./Button";
import { encryptFile } from "../util";
import { TagsInput } from "react-tag-input-component";

export const Modal = () => {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [passPhrase, setPassPhrase] = useState("");
  const [valid, setValid] = useState(false);
  const [progress, setProgress] = useState(false);
  const [file, setFile] = useState(undefined);
  const [thumbnail, setThumbnail] = useState(undefined);
  const [encrypted, setEncrypted] = useState(false);
  const [title, setTitle] = useState("");
  const [inventor, setInventor] = useState("");
  const [tags, setTags] = useState([]);
  const uploadElement = useRef(null);
  const thumbnailElement = useRef(null);

  const date = new Date();
  const year = date.getFullYear();
  date.setFullYear(year + 1);
  const defaultDate = date.toISOString().split("T")[0];
  console.log(defaultDate);
  const [publicDate, setPublicDate] = useState(defaultDate);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setValid(
      description !== "" &&
        title !== "" &&
        file != null &&
        inventor !== "" &&
        user != null &&
        (encrypted ? passPhrase !== "" : true)
    );
  }, [description, user, file, inventor, passPhrase, encrypted, title]);

  const reload = () => {
    const event = new Event("reload");
    window.dispatchEvent(event);
  };

  const add = async () => {
    // Demo purpose therefore edge case not properly handled
    if ([null, undefined].includes(user)) {
      return;
    }

    setProgress(true);

    try {
      let url;
      let image;
      let imageFilename;

      const key = nanoid();

      await setDoc({
        collection: "activity",
        doc: {
          key: nanoid(),
          description: key,
          data: {
            documentId: key,
            user: user.key,
            action: "creating idea",
          },
        },
      });
      if (thumbnail !== undefined) {
        const extension = thumbnail.name.split(".").pop();
        imageFilename = thumbnail.name;

        const { downloadUrl } = await uploadFile({
          collection: "images",
          data: thumbnail,
          filename: `${user.key}-${key}.thumbnail.${extension}`,
        });
        image = downloadUrl;
        await setDoc({
          collection: "activity",
          doc: {
            key: nanoid(),
            description: key,
            data: {
              documentId: key,
              user: user.key,
              action: "uploaded thumbnail",
            },
          },
        });
      }
      let filename = undefined;
      if (file !== undefined) {
        const extension = file.name.split(".").pop();
        const finalFile = await encryptFile(
          file,
          encrypted ? passPhrase : null
        );

        filename = file.name;

        const { downloadUrl } = await uploadFile({
          collection: "images",
          data: finalFile,
          filename: passPhrase
            ? `${key}.${extension}.enc`
            : `${key}.${extension}`,
        });

        await setDoc({
          collection: "activity",
          doc: {
            key: nanoid(),
            description: key,
            data: {
              documentId: key,
              user: user.key,
              action: "uploaded document",
            },
          },
        });
        url = downloadUrl;
      }

      await setDoc({
        collection: "notes",
        doc: {
          key,
          data: {
            file: file !== undefined ? file.name : undefined,
            filename,
            imageFilename,
            image,
            mimeType: file !== undefined ? file.type : undefined,
            encrypted,
            description,
            inventor,
            title,
            tags,
            shared: false,
            decrypt_at: encrypted
              ? BigInt(new Date(publicDate).getTime()) * 1000000n
              : null,
            ...(url !== undefined && { url }),
          },
        },
      });

      await setDoc({
        collection: "activity",
        doc: {
          key: nanoid(),
          description: key,
          data: {
            documentId: key,
            user: user.key,
            action: "created document",
          },
        },
      });

      setShowModal(false);
      setDescription("");
      setPassPhrase("");
      setValid(false);
      setProgress(false);
      setFile(undefined);
      setTitle("");
      setTags([]);
      setEncrypted(false);
      setInventor("");
      setThumbnail(undefined);

      reload();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setProgress(false);
    }
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Add an entry{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          viewBox="0 -960 960 960"
          width="20"
          fill="currentColor"
        >
          <title>Add an Idea</title>
          <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
        </svg>
      </Button>

      {showModal ? (
        <>
          <form
            className="absolute top-5 inset-0 z-50 p-16 md:px-24 md:py-44 animate-fade"
            role="dialog"
          >
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
                onChange={(e) => {
                  setInventor(e.target.value);
                }}
                value={inventor}
                disabled={progress}
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
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                value={title}
                disabled={progress}
              />
            </div>

            <div className="relative w-full max-w-xl">
              <div className="bg-gray-50 mb-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <button
                  type="button"
                  aria-label="Attach a thumbnail to the entry"
                  onClick={() => thumbnailElement?.current?.click()}
                  className="flex gap-2 items-center hover:text-blue-600 active:text-blue-400"
                >
                  <svg
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 29 29"
                    fill="currentColor"
                  >
                    <title>Attach thumbnail</title>
                    <g>
                      <rect
                        fill="none"
                        className="opacity-25"
                        width="29"
                        height="29"
                      />
                      <path d="M8.36,26.92c-2,0-3.88-.78-5.29-2.19C.15,21.81.15,17.06,3.06,14.14L12.57,4.64c.39-.39,1.02-.39,1.41,0s.39,1.02,0,1.41L4.48,15.56c-2.14,2.14-2.14,5.62,0,7.76,1.04,1.04,2.41,1.61,3.88,1.61s2.84-.57,3.88-1.61l12.79-12.79c1.47-1.47,1.47-3.87,0-5.34-1.47-1.47-3.87-1.47-5.34,0l-12.45,12.45c-.73.73-.73,1.91,0,2.64.73.73,1.91.73,2.64,0l9.17-9.17c.39-.39,1.02-.39,1.41,0s.39,1.02,0,1.41l-9.17,9.17c-1.51,1.51-3.96,1.51-5.47,0-1.51-1.51-1.51-3.96,0-5.47L18.26,3.77c2.25-2.25,5.92-2.25,8.17,0s2.25,5.92,0,8.17l-12.79,12.79c-1.41,1.41-3.29,2.19-5.29,2.19Z" />
                    </g>
                  </svg>
                  <span className="truncate max-w-48">
                    <small>
                      {thumbnail !== undefined
                        ? thumbnail.name
                        : "Attach thumbnail"}
                    </small>
                  </span>
                </button>

                <input
                  ref={thumbnailElement}
                  type="file"
                  accept="image/*"
                  className="fixed right-0 -bottom-24 opacity-0"
                  onChange={(event) => setThumbnail(event.target.files?.[0])}
                  disabled={progress}
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
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
                disabled={progress}
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
                value={tags}
                onChange={setTags}
                name="tags"
                placeHolder="Enter tags"
              />
            </div>

            <div className="relative w-full max-w-xl">
              <div className="bg-gray-50 mb-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <div>
                  <button
                    type="button"
                    aria-label="Attach a file to the entry"
                    onClick={() => uploadElement?.current?.click()}
                    className="flex gap-2 items-center hover:text-blue-600 active:text-blue-400"
                  >
                    <svg
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 29 29"
                      fill="currentColor"
                    >
                      <title>Attach a file</title>
                      <g>
                        <rect
                          fill="none"
                          className="opacity-25"
                          width="29"
                          height="29"
                        />
                        <path d="M8.36,26.92c-2,0-3.88-.78-5.29-2.19C.15,21.81.15,17.06,3.06,14.14L12.57,4.64c.39-.39,1.02-.39,1.41,0s.39,1.02,0,1.41L4.48,15.56c-2.14,2.14-2.14,5.62,0,7.76,1.04,1.04,2.41,1.61,3.88,1.61s2.84-.57,3.88-1.61l12.79-12.79c1.47-1.47,1.47-3.87,0-5.34-1.47-1.47-3.87-1.47-5.34,0l-12.45,12.45c-.73.73-.73,1.91,0,2.64.73.73,1.91.73,2.64,0l9.17-9.17c.39-.39,1.02-.39,1.41,0s.39,1.02,0,1.41l-9.17,9.17c-1.51,1.51-3.96,1.51-5.47,0-1.51-1.51-1.51-3.96,0-5.47L18.26,3.77c2.25-2.25,5.92-2.25,8.17,0s2.25,5.92,0,8.17l-12.79,12.79c-1.41,1.41-3.29,2.19-5.29,2.19Z" />
                      </g>
                    </svg>
                    <span className="truncate max-w-48">
                      <small>
                        {file !== undefined ? file.name : "Attach file"}
                      </small>
                    </span>
                  </button>

                  <input
                    ref={uploadElement}
                    type="file"
                    className="fixed right-0 -bottom-24 opacity-0"
                    onChange={(event) => setFile(event.target.files?.[0])}
                    disabled={progress}
                  />
                </div>
                {file != null ? (
                  <div className="relative w-full max-w-xl">
                    <div className="flex items-center my-3">
                      <input
                        checked={encrypted}
                        onChange={(e) => {
                          setEncrypted(e.target.checked);
                        }}
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
                            htmlFor="passPhrase"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Entryption Pass Phrase
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
                            placeholder="Decryption Date"
                            type="date"
                            onChange={(e) => {
                              console.log(e.target.value);
                              setPublicDate(e.target.value);
                            }}
                            value={publicDate}
                            disabled={progress}
                          />
                        </div>
                      </>
                    ) : undefined}
                  </div>
                ) : undefined}
              </div>
            </div>
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
                    setDescription("");
                    setPassPhrase("");
                    setValid(false);
                    setProgress(false);
                    setFile(undefined);
                    setTitle("");
                    setTags([]);
                    setInventor("");
                    setEncrypted(false);
                    setThumbnail(undefined);
                  }}
                >
                  Close
                </button>

                <Button onClick={add} disabled={!valid}>
                  Submit
                </Button>
              </div>
            )}
          </form>
          <Backdrop />
        </>
      ) : null}
    </>
  );
};
