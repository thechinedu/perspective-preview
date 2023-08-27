import { render, screen, userEvent, within } from "@/test-utils";
import Home from "@/app/components/Home";
import { FunnelData } from "@/app/providers/FunnelDataProvider";

const setupUserAndUploadFunnelData = async (funnelData: FunnelData) => {
  const user = userEvent.setup();
  const btn = screen.getByRole("button", { name: /upload funnel data/i });

  expect(btn).toBeInTheDocument();

  await user.click(btn);

  const dialog = screen.getByRole("dialog", { name: /upload funnel data/i });

  expect(dialog).toBeInTheDocument();

  const uploadInput = screen.getByLabelText(/choose file to upload/i);
  const uploadBtn = screen.getByRole("button", { name: /upload/i });

  expect(uploadInput).toBeInTheDocument();
  expect(uploadBtn).toBeDisabled();

  await user.upload(
    uploadInput,
    new File([JSON.stringify(funnelData)], "test-funnel-data.json")
  );

  expect(uploadBtn).toBeEnabled();
  expect(within(dialog).getByText("test-funnel-data.json")).toBeInTheDocument();

  await user.click(uploadBtn);

  expect(dialog).not.toBeInTheDocument();

  return user;
};

describe("Funnel preview", () => {
  test("Uploading funnel data", async () => {
    render(<Home />);

    await setupUserAndUploadFunnelData({
      name: "The preview funnel",
      bgColor: "#ffffff",
      pages: [
        {
          id: "page-1",
          blocks: [
            {
              id: "block-1",
              type: "text",
              text: "This is a text block",
              color: "#000000",
              align: "center",
            },
          ],
        },
      ],
    });

    expect(screen.getByText(/the preview funnel/i)).toBeInTheDocument();
  });

  describe("Previewing funnel data", () => {
    test("Previewing funnel data with a text block", async () => {
      render(<Home />);

      await setupUserAndUploadFunnelData({
        name: "The preview funnel",
        bgColor: "#ffffff",
        pages: [
          {
            id: "page-1",
            blocks: [
              {
                id: "block-1",
                type: "text",
                text: "This is a text block",
                color: "#000000",
                align: "center",
              },
            ],
          },
        ],
      });

      const textBlock = screen.getByText(/this is a text block/i);

      expect(textBlock).toBeInTheDocument();
      expect(textBlock).toHaveStyle({ color: "#000000", textAlign: "center" });
    });

    test("Previewing funnel data with an image block", async () => {
      render(<Home />);

      await setupUserAndUploadFunnelData({
        name: "The preview funnel",
        bgColor: "#ffffff",
        pages: [
          {
            id: "page-1",
            blocks: [
              {
                id: "block-1",
                type: "image",
                src: "https://via.example.com/150",
              },
            ],
          },
        ],
      });

      const previewContainer = screen.getByTestId("preview-container");
      const imageBlock = within(previewContainer).getByRole(
        "img"
      ) as HTMLImageElement;

      expect(imageBlock).toBeInTheDocument();
      expect(decodeURIComponent(imageBlock.src)).toContain(
        "https://via.example.com/150"
      );
    });

    test("Previewing funnel data with a list block", async () => {
      render(<Home />);

      await setupUserAndUploadFunnelData({
        name: "The preview funnel",
        bgColor: "#ffffff",
        pages: [
          {
            id: "page-1",
            blocks: [
              {
                id: "block-1",
                type: "list",
                items: [
                  {
                    title: "Item 1",
                    description: "Item 1 description",
                    src: "https://via.example.com/item1",
                  },
                  {
                    title: "Item 2",
                    description: "Item 2 description",
                    src: "https://via.example.com/item2",
                  },
                ],
              },
            ],
          },
        ],
      });

      const listBlock = screen.getByRole("list");

      expect(listBlock).toBeInTheDocument();
      expect(listBlock.children).toHaveLength(2);

      const listItems = screen.getAllByRole("listitem");
      const [listItem1, listItem2] = listItems;

      const listItem1Container = within(listItem1);
      const listItem2Container = within(listItem2);

      expect(listItem1Container.getByText(/item 1$/i)).toBeInTheDocument();
      expect(
        listItem1Container.getByText(/item 1 description/i)
      ).toBeInTheDocument();
      expect(
        decodeURIComponent(
          (listItem1Container.getByRole("img") as HTMLImageElement).src
        )
      ).toContain("https://via.example.com/item1");

      expect(listItem2Container.getByText(/item 2$/i)).toBeInTheDocument();
      expect(
        listItem2Container.getByText(/item 2 description/i)
      ).toBeInTheDocument();
      expect(
        decodeURIComponent(
          (listItem2Container.getByRole("img") as HTMLImageElement).src
        )
      ).toContain("https://via.example.com/item2");
    });

    test("Previewing funnel data with a button block", async () => {
      render(<Home />);

      await setupUserAndUploadFunnelData({
        name: "The preview funnel",
        bgColor: "#ffffff",
        pages: [
          {
            id: "page-1",
            blocks: [
              {
                id: "block-1",
                type: "button",
                text: "Click me",
                color: "#ffffff",
                bgColor: "#000000",
              },
            ],
          },
        ],
      });

      const buttonBlock = screen.getByRole("button", { name: /click me/i });

      expect(buttonBlock).toBeInTheDocument();
      expect(buttonBlock).toHaveStyle({
        color: "#ffffff",
        backgroundColor: "#000000",
      });
    });

    test("Previewing funnel data with multiple blocks", async () => {
      render(<Home />);

      await setupUserAndUploadFunnelData({
        name: "The preview funnel",
        bgColor: "#ffffff",
        pages: [
          {
            id: "page-1",
            blocks: [
              {
                id: "block-1",
                type: "text",
                text: "This is a text block",
                color: "#000000",
                align: "center",
              },
              {
                id: "block-2",
                type: "image",
                src: "https://via.example.com/150",
              },
              {
                id: "block-3",
                type: "list",
                items: [
                  {
                    title: "Item 1",
                    description: "Item 1 description",
                    src: "https://via.example.com/item1",
                  },
                ],
              },
              {
                id: "block-4",
                type: "button",
                text: "Click me",
                color: "#ffffff",
                bgColor: "#000000",
              },
            ],
          },
        ],
      });

      const previewContainer = screen.getByTestId("preview-container");
      const textBlock =
        within(previewContainer).getByText(/this is a text block/i);
      const imageBlock = within(previewContainer).getByTestId(
        "image-block"
      ) as HTMLImageElement;
      const listBlock = screen.getByRole("list");
      const buttonBlock = screen.getByRole("button", { name: /click me/i });

      expect(textBlock).toBeInTheDocument();
      expect(imageBlock).toBeInTheDocument();
      expect(listBlock).toBeInTheDocument();
      expect(buttonBlock).toBeInTheDocument();
    });
  });

  test("navigating between pages", async () => {
    render(<Home />);

    const user = await setupUserAndUploadFunnelData({
      name: "The preview funnel",
      bgColor: "#ffffff",
      pages: [
        {
          id: "page-1",
          blocks: [
            {
              id: "block-1",
              type: "text",
              text: "This is page 1",
              color: "#000000",
              align: "center",
            },
          ],
        },
        {
          id: "page-2",
          blocks: [
            {
              id: "block-1",
              type: "text",
              text: "This is page 2",
              color: "#000000",
              align: "center",
            },
          ],
        },
      ],
    });

    const previewContainer = screen.getByTestId("preview-container");
    const nextButton = screen.getByRole("button", { name: /next page/i });
    const prevButton = screen.getByRole("button", { name: /previous page/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();

    await user.click(nextButton);

    expect(
      within(previewContainer).getByText(/this is page 2/i)
    ).toBeInTheDocument();
    expect(
      within(previewContainer).queryByText(/this is page 1/i)
    ).not.toBeInTheDocument();

    expect(nextButton).toBeDisabled();
    expect(prevButton).toBeEnabled();

    await user.click(prevButton);

    expect(
      within(previewContainer).getByText(/this is page 1/i)
    ).toBeInTheDocument();
    expect(
      within(previewContainer).queryByText(/this is page 2/i)
    ).not.toBeInTheDocument();
  });
});
