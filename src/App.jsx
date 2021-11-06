import { Children, useState, useEffect } from "react";
import useGoogleSheets from "use-google-sheets";
import { ResponsiveSankey } from "@nivo/sankey";
import { ethers } from "ethers";
import config from "./config";

const etherscan = "https://rinkeby.etherscan.io";
const format = (v) => `Ξ${v}`;

const formatAddress = (address) =>{
  if(address.length > 20) return`${address.slice(0, 6)}...${address.slice(-4)}`;
  return address
}

function App() {
  const [tx, setTx] = useState();
  const [address, setAddress] = useState();
  const [counter, setCounter] = useState(60);
  const [height, setHeight] = useState();
  const [transcations, setTranscations] = useState([]);
  const { data, loading, error, refetch } = useGoogleSheets({
    apiKey: config.apiKey,
    sheetId: config.sheetId,
  });
  console.log();
  useEffect(() => {
    if (error === null && loading && data.length > 0) {
      if (data[0].data.length > 0) {
        const table = data[0].data;
        setTx(
          Object.assign(
            {},
            ...table.map((e) => {
              let txId = `${formatAddress(e.from)}-${formatAddress(e.to)}`;
              return {
                [txId]: e.tx,
              };
            })
          )
        );
        const address = [
          { [formatAddress(table[0].from)]: table[0].from },
        ].concat(
          table.map((e) => {
            return { [formatAddress(e.to)]: e.to };
          })
        );
        setAddress(Object.assign({}, ...address));
        const nodes = [{ id: formatAddress(table[0].from) }]
          .concat(
            table.map((e) => {
              return { id: formatAddress(e.to) };
            })
          )
          .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
        if (nodes.length < 5) {
          setHeight(750);
        } else {
          setHeight(nodes.length * 50);
        }
        const links = table.map((e) => {
          return {
            sourceFull: e.from,
            source: formatAddress(e.from),
            target: formatAddress(e.to),
            targetFull: e.to,
            value: ethers.utils.formatEther(
              Number(e.value.replace(",", ".")).toString()
            ),
          };
        });
        setTranscations({
          nodes: nodes,
          links: links,
        });
      }
    }
  }, [transcations, data]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCounter(counter - 1);
      if (counter === 0) {
        setCounter(60);
        refetch();
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [counter]);
  if (loading && transcations.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
  }
  return (
    <div
      className="flex justify-center flex-col bg-gray-700 bg-opacity-50 rounded-b-lg"
      style={{ height: height }}
    >
      <div className="flex justify-center">
        <button
          onClick={refetch}
          className="rounded-md w-48 text-gray-900 bg-green-400 hover:bg-green-300 h-8 mt-2 text-center"
        >
          Refetch in {counter}s
        </button>
      </div>
      <ResponsiveSankey
        data={transcations}
        margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
        valueFormat={format}
        layout="vertical"
        align="justify"
        colors={{ scheme: "category10" }}
        nodeOpacity={1}
        nodeHoverOthersOpacity={0.35}
        nodeThickness={24}
        nodeSpacing={0}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        nodeBorderRadius={3}
        linkOpacity={0.55}
        linkHoverOthersOpacity={0.1}
        linkContract={3}
        linkBlendMode="screen"
        enableLinkGradient={true}
        labelPadding={-12}
        labelTextColor="#ffffff"
        onClick={(data) => {
          if (data.id) {
            window.open(`${etherscan}/address/${address[data.id]}`);
          }
          if (data.source && data.target) {
            let id = `${data.source.id}-${data.target.id}`;
            window.open(`${etherscan}/tx/${tx[id]}`, "_blank");
          }
        }}
      />
    </div>
  );
}

export default App;
