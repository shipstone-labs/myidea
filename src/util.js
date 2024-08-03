export async function readFile(file) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsArrayBuffer(file);
  });
}

export async function encryptFile(objFile, passPhrase = undefined) {
  if (passPhrase != null) {
    const arrayBuffer = await readFile(objFile).catch((err) => {
      console.error(err);
      throw new Error("Error reading file");
    });

    const plaintextbytes = new Uint8Array(arrayBuffer);

    const pbkdf2iterations = 10000;
    const passphrasebytes = new TextEncoder("utf-8").encode(passPhrase);
    const pbkdf2salt = window.crypto.getRandomValues(new Uint8Array(8));

    const passphrasekey = await window.crypto.subtle
      .importKey("raw", passphrasebytes, { name: "PBKDF2" }, false, [
        "deriveBits",
      ])
      .catch((err) => {
        console.error(err);
        throw err;
      });

    const pbkdf2bytesRaw = await window.crypto.subtle
      .deriveBits(
        {
          name: "PBKDF2",
          salt: pbkdf2salt,
          iterations: pbkdf2iterations,
          hash: "SHA-256",
        },
        passphrasekey,
        384
      )
      .catch((err) => {
        console.error(err);
        throw err;
      });

    const pbkdf2bytes = new Uint8Array(pbkdf2bytesRaw);

    const keybytes = pbkdf2bytes.slice(0, 32);
    const ivbytes = pbkdf2bytes.slice(32);

    const key = await window.crypto.subtle
      .importKey("raw", keybytes, { name: "AES-CBC", length: 256 }, false, [
        "encrypt",
      ])
      .catch((err) => {
        console.error(err);
        throw err;
      });

    const cipherbytesRaw = await window.crypto.subtle
      .encrypt({ name: "AES-CBC", iv: ivbytes }, key, plaintextbytes)
      .catch((err) => {
        console.error(err);
        throw err;
      });
    const cipherbytes = new Uint8Array(cipherbytesRaw);

    const resultbytes = new Uint8Array(cipherbytes.length + 16);
    resultbytes.set(new TextEncoder("utf-8").encode("Salted__"));
    resultbytes.set(pbkdf2salt, 8);
    resultbytes.set(cipherbytes, 16);

    return new File([resultbytes], `${objFile.name}.enc`, {
      type: "application/download",
    });
  }
  return objFile;
}

export async function decryptFile(
  url,
  passPhrase = undefined,
  filename = undefined,
  mimeType = undefined
) {
  if (!passPhrase) {
    return url;
  }
  const cipherbytesRaw = await fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.arrayBuffer();
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });

  const cipherbytes = new Uint8Array(cipherbytesRaw);

  const pbkdf2iterations = 10000;
  const passphrasebytes = new TextEncoder("utf-8").encode(passPhrase);
  const pbkdf2salt = cipherbytes.slice(8, 16);

  const passphrasekey = await window.crypto.subtle
    .importKey("raw", passphrasebytes, { name: "PBKDF2" }, false, [
      "deriveBits",
    ])
    .catch((err) => {
      console.error(err);
      throw err;
    });

  const pbkdf2bytesRaw = await window.crypto.subtle
    .deriveBits(
      {
        name: "PBKDF2",
        salt: pbkdf2salt,
        iterations: pbkdf2iterations,
        hash: "SHA-256",
      },
      passphrasekey,
      384
    )
    .catch((err) => {
      console.error(err);
      throw err;
    });

  const pbkdf2bytes = new Uint8Array(pbkdf2bytesRaw);

  const keybytes = pbkdf2bytes.slice(0, 32);
  const ivbytes = pbkdf2bytes.slice(32);
  const cipherbytesReal = cipherbytes.slice(16);

  const key = await window.crypto.subtle
    .importKey("raw", keybytes, { name: "AES-CBC", length: 256 }, false, [
      "decrypt",
    ])
    .catch((err) => {
      console.error(err);
      throw err;
    });

  const plaintextbytesRaw = await window.crypto.subtle
    .decrypt({ name: "AES-CBC", iv: ivbytes }, key, cipherbytesReal)
    .catch((err) => {
      console.error(err);
      throw err;
    });

  const plaintextbytes = new Uint8Array(plaintextbytesRaw);

  const blob = new File([plaintextbytes], filename, {
    type: mimeType || "application/pdf",
  });
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}
