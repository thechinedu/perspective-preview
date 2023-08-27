import {
  FunnelBlock,
  FunnelBlockButton,
  FunnelBlockImage,
  FunnelBlockList,
  FunnelBlockText,
} from "@/app/providers/FunnelDataProvider";
import { Property } from "csstype";
import Image from "next/image";

export const Blocks = {
  text: (block: FunnelBlock) => {
    const { text, color, align } = block as FunnelBlockText;

    return (
      <p
        key={block.id}
        style={{ color, textAlign: align as Property.TextAlign }}
        className="mt-4"
      >
        {text}
      </p>
    );
  },
  image: (block: FunnelBlock) => {
    const { src } = block as FunnelBlockImage;
    return (
      <Image
        key={block.id}
        data-testid="image-block"
        src={src}
        alt=""
        width={375}
        height={600}
        style={{ width: "100%", height: "auto" }}
        className="mt-2"
      />
    );
  },
  list: (block: FunnelBlock) => {
    const { items } = block as FunnelBlockList;
    return (
      <ul key={block.id} className="mt-2 flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex items-center gap-4 bg-white p-4 border-b border-solid border-gray-200 rounded-md"
          >
            <div>
              <Image
                data-testid="list-image-block"
                src={item.src}
                alt=""
                width={24}
                height={24}
              />
            </div>

            <div>
              <p>{item.title}</p>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  },
  button: (block: FunnelBlock) => {
    const {
      text,
      color,
      bgColor: backgroundColor,
    } = block as FunnelBlockButton;
    return (
      <button
        key={block.id}
        style={{ color, backgroundColor }}
        className="py-2 px-4 mt-4 block text-center w-full rounded"
      >
        {text}
      </button>
    );
  },
};
