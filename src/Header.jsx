import config from "./config";

function Header() {
  return (
    <div className="flex flex-col bg-gray-700 bg-opacity-50 rounded-t-lg mt-8">
      <h1 className="text-5xl text-gray-50 text-center m-2 w-full">
        🔭Transaction propagation watcher
      </h1>
      <div className="flex justify-center">
        <p className="text-base break-all text-gray-50 text-center m-2 w-1/2">
          monitor and visualise transaction propagation of Ethereum coins,
          started from
          <a
            className="text-blue-500 hover:text-blue-300"
            href={`https://rinkeby.etherscan.io/address/${config.mainAddress}`}
            target="_blank"
          >
            {config.mainAddress}
          </a>
          and spreading across blockchain to different addresses.
        </p>
      </div>
    </div>
  );
}

export default Header;
