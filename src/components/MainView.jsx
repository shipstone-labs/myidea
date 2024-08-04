import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "./Auth";
import { listDocs } from "@junobuild/core";
import { useEffect } from "react";
import { Table } from "./Table";
import { View } from "./View";
import { Modal } from "./Modal";
import { getKey } from "../util";

export const MainView = () => {
  const [requests, setRequests] = useState({});
  const { user } = useContext(AuthContext);
  const [focusedRow, setFocusedRow] = useState(null);

  useEffect(() => {
    if (!user?.key) {
      return;
    }
    const doList = async () => {
      await getKey("something");
      listDocs({
        collection: "requests",
        filter: {
          matcher: {
            description: `(^|:)${user.key}(:|$)`,
          },
        },
      })
        .then(({ items }) => {
          const requests = {};
          for (const item of items) {
            let list = requests[item.data.documentId];
            if (!list) {
              list = requests[item.data.documentId] = [];
            }
            list.push(item);
          }
          setRequests(requests);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    window.addEventListener("reload", doList);
    doList();
    return () => {
      window.removeEventListener("reload", doList);
    };
  }, [user]);
  return (
    <>
      <Table setFocusedRow={setFocusedRow} requests={requests} />
      <Modal />
      <View
        row={focusedRow}
        onClose={() => setFocusedRow(null)}
        requests={requests}
      />
    </>
  );
};
