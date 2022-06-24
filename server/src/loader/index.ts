import basicLoader from "@loader/basic";
import socketLoader from "@loader/socket";
const Loader = ({ server, app }: { server: any; app: any }): void => {
  basicLoader(app);
  socketLoader(server, app);
};

export default Loader;
