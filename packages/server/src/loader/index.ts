import basicLoader from "./basic";
import socketLoader from "./socket";

const Loader = ({ server, app }: { server: any; app: any }): void => {
  basicLoader(app);
  socketLoader(server, app);
};

export default Loader;
