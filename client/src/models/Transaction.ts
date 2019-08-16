import { types } from "mobx-state-tree";

const Transaction = types
  .model("Transaction", {
    status: types.optional(
      types.enumeration(["NONE", "PENDING", "MINED", "ERROR"]),
      "NONE"
    ),
    hash: types.maybeNull(types.string),
    error: types.maybeNull(types.string)
  })
  .actions(self => ({
    update(updates: Partial<typeof self>) {
      for (let key in updates) {
        self[key] = updates[key];
      }
    },
    reset() {
      self.status = "NONE";
      self.hash = null;
      self.error = null;
    }
  }))
  .actions(self => ({
    run(fn: () => any) {
      return new Promise(async resolve => {
        fn()
          .once("transactionHash", (hash: string) => {
            self.update({
              status: "PENDING",
              hash
            });
          })
          .on("confirmation", () => {
            self.update({
              status: "MINED"
            });

            resolve(self.hash);
          })
          .on("error", (error: Error) => {
            self.update({
              status: "ERROR",
              error: error.toString()
            });

            resolve(self.hash);
          })
          .then(() => {
            self.update({
              status: "MINED"
            });

            resolve(self.hash);
          });
      });
    }
  }));

export default Transaction;
