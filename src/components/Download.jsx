/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { AuthContext } from "./Auth";
import { Backdrop } from "./Backdrop";
import { Button } from "./Button";
import { decryptFile } from "../util";
import { FaFileDownload, FaUserSecret } from "react-icons/fa";

export const Download = ({
	url,
	filename,
	mimeType,
	encrypted: _encrypted,
}) => {
	const [showModal, setShowModal] = useState(false);
	const [passPhrase, setPassPhrase] = useState("");
	const [progress, setProgress] = useState(false);
	const encrypted = _encrypted || (url || filename || "").endsWith(".enc");

	const { user } = useContext(AuthContext);

	const download = async () => {
		// Demo purpose therefore edge case not properly handled
		if ([null, undefined].includes(user)) {
			return;
		}

		setProgress(true);

		try {
			const file = await decryptFile(url, passPhrase, filename, mimeType);
			window.open(file, "_blank");

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
		<>
			<Button
				onClick={() => {
					encrypted ? setShowModal(true) : window.open(url, "_blank");
				}}
			>
				Download <FaUserSecret className="inline-block align-middle" />
				<FaFileDownload className="inline-block align-middle" />
			</Button>

			{showModal ? (
				<>
					<div
						className="fixed inset-0 z-50 p-16 md:px-24 md:py-44 animate-fade"
						role="dialog"
					>
						<div className="relative w-full max-w-xl">
							<input
								className="
                  form-control
                  block
                  w-full
                  px-3
                  py-1.5
                  text-base
                  font-normal
                  m-0
                  resize-none
                  border-black border-[3px] rounded-sm bg-white shadow-[5px_5px_0px_rgba(0,0,0,1)]
                  focus:outline-none
                "
								placeholder="Your pass phrase"
								type="password"
								onChange={(e) => {
									setPassPhrase(e.target.value);
								}}
								value={passPhrase}
								disabled={progress}
							/>
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
										className="py-1 px-8 hover:text-lavender-blue-600 active:text-lavender-blue-400"
										type="button"
										onClick={() => {
											setShowModal(false);
											setPassPhrase("");
										}}
									>
										Close
									</button>

									<Button onClick={download} disabled={passPhrase === ""}>
										Submit
									</Button>
								</div>
							)}
						</div>
					</div>
					<Backdrop />
				</>
			) : null}
		</>
	);
};
