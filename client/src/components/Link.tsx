import router from "../stores/router";

interface ILinkProps {
  children?: any;
  page: typeof router.page;
  beforeClick?: () => any;
}

const Link = ({ children, page, beforeClick = () => {} }: ILinkProps) => (
  <div
    onClick={() => {
      beforeClick();
      router.changePage(page);
    }}
  >
    {children}
  </div>
);

export default Link;
