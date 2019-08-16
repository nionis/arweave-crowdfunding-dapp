import { types } from "mobx-state-tree";

const Donation = types.model("Donation", {
  user: types.string,
  amount: types.string
});

export default Donation;
